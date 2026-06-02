import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET /api/keychains
// List all claimed keychains for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: keychains, error } = await supabase
      .from('user_keychains')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[keychains GET] DB Error:', error);
      return NextResponse.json({ error: 'Gagal mengambil data keychain' }, { status: 500 });
    }

    return NextResponse.json({ keychains });
  } catch (err) {
    console.error('[keychains GET] Exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/keychains
// Handle claim, update, and delete actions
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Aksi (action) tidak ditentukan' }, { status: 400 });
    }

    // --- ACTION: CLAIM ---
    if (action === 'claim') {
      const { token, label } = body;

      if (!token) {
        return NextResponse.json({ error: 'Kode keychain wajib diisi' }, { status: 400 });
      }

      const cleanToken = token.trim().toLowerCase();
      const finalLabel = label?.trim() || 'OneTap Keychain';

      // Check if this token is already claimed
      const { data: existing, error: fetchError } = await supabase
        .from('user_keychains')
        .select('*')
        .eq('token', cleanToken)
        .maybeSingle();

      if (fetchError) {
        console.error('[keychains CLAIM] DB Error on select:', fetchError);
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
      }

      if (existing) {
        if (existing.user_id) {
          if (existing.user_id === user.id) {
            return NextResponse.json({ success: true, keychain: existing, message: 'Keychain sudah terdaftar di akun Anda' });
          } else {
            return NextResponse.json({ error: 'Kode keychain ini sudah diklaim oleh pengguna lain' }, { status: 400 });
          }
        } else {
          // Exists but unclaimed (pre-populated factory keychain) -> Update owner
          const { data: updated, error: updateError } = await supabase
            .from('user_keychains')
            .update({
              user_id: user.id,
              label: existing.label || finalLabel,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();

          if (updateError) {
            console.error('[keychains CLAIM] DB Error on update:', updateError);
            return NextResponse.json({ error: 'Gagal mengklaim keychain' }, { status: 500 });
          }

          return NextResponse.json({ success: true, keychain: updated });
        }
      } else {
        // Does not exist -> Create and claim on the fly (frictionless for blank tags)
        const { data: inserted, error: insertError } = await supabase
          .from('user_keychains')
          .insert({
            token: cleanToken,
            user_id: user.id,
            label: finalLabel,
            active_mode: 'url',
            payload_data: {}
          })
          .select()
          .single();

        if (insertError) {
          console.error('[keychains CLAIM] DB Error on insert:', insertError);
          return NextResponse.json({ error: 'Gagal mendaftarkan kode keychain baru' }, { status: 500 });
        }

        return NextResponse.json({ success: true, keychain: inserted });
      }
    }

    // --- ACTION: UPDATE ---
    if (action === 'update') {
      const { id, label, active_mode, payload_data, link_password, tag_password } = body;

      if (!id) {
        return NextResponse.json({ error: 'ID keychain wajib diisi' }, { status: 400 });
      }

      // Verify ownership
      const { data: existing, error: fetchError } = await supabase
        .from('user_keychains')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError || !existing) {
        return NextResponse.json({ error: 'Keychain tidak ditemukan' }, { status: 444 });
      }

      if (existing.user_id !== user.id) {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }

      const final_payload = { ...(payload_data || {}) };

      // Handle Link Protection Password
      if (link_password === '••••••••' || link_password === '__KEEP_EXISTING__') {
        // Keep existing password hash if present
        if (existing.payload_data && existing.payload_data.link_password_hash) {
          final_payload.link_password_hash = existing.payload_data.link_password_hash;
        } else {
          delete final_payload.link_password_hash;
        }
      } else if (link_password && link_password.trim() !== '') {
        // Hash and store new password
        const salt = await bcrypt.genSalt(10);
        final_payload.link_password_hash = await bcrypt.hash(link_password.trim(), salt);
      } else {
        // Remove protection password
        delete final_payload.link_password_hash;
      }

      // Handle NFC Tag Protection Password
      if (tag_password && tag_password.trim() !== '') {
        final_payload.tag_password = tag_password.trim();
      } else {
        delete final_payload.tag_password;
      }

      const { data: updated, error: updateError } = await supabase
        .from('user_keychains')
        .update({
          label: label?.trim() || undefined,
          active_mode: active_mode || undefined,
          payload_data: final_payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('[keychains UPDATE] DB Error:', updateError);
        return NextResponse.json({ error: 'Gagal memperbarui konfigurasi keychain' }, { status: 500 });
      }

      return NextResponse.json({ success: true, keychain: updated });
    }

    // --- ACTION: DELETE ---
    if (action === 'delete') {
      const { id } = body;

      if (!id) {
        return NextResponse.json({ error: 'ID keychain wajib diisi' }, { status: 400 });
      }

      // Verify ownership & delete
      const { error: deleteError } = await supabase
        .from('user_keychains')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('[keychains DELETE] DB Error:', deleteError);
        return NextResponse.json({ error: 'Gagal menghapus keychain' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (err) {
    console.error('[keychains POST] Exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
