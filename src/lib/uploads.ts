import { supabase } from "@/integrations/supabase/client";

/** Uploads an avatar file to the user's folder; returns a public URL. */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

/** Uploads an APK or icon file to the app-files bucket; returns a public URL. */
export async function uploadAppFile(file: File, folder = "apks"): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage
    .from("app-files")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("app-files").getPublicUrl(path);
  return data.publicUrl;
}
