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
