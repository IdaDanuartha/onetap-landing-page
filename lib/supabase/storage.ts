import { createClient } from './client';

export async function uploadAvatar(userId: string, file: File) {
  const supabase = createClient();
  
  // Create a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar_${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload the file to the 'avatars' bucket
  const { data, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadBg(userId: string, file: File) {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `bg_${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteStorageFile(url: string) {
  if (!url) return;
  const supabase = createClient();
  
  // Check if the URL is from our public storage bucket
  if (url.includes('/storage/v1/object/public/avatars/')) {
    try {
      // Extract the path after 'avatars/'
      const parts = url.split('/avatars/');
      if (parts.length > 1) {
        const filePath = decodeURIComponent(parts[1]);
        await supabase.storage.from('avatars').remove([filePath]);
      }
    } catch (e) {
      console.error('Failed to delete old file from storage:', e);
    }
  }
}


