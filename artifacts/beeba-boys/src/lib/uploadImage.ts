import { supabase } from "./supabase";

/**
 * Uploads an image file to the Supabase Storage "media" bucket and
 * returns its public URL. Used anywhere admin previously had to paste
 * a raw image URL (team photos, gallery, etc.).
 *
 * Requires a public storage bucket named "media" to exist in Supabase
 * (Storage → New bucket → name: media → Public bucket: ON), with a
 * policy allowing authenticated users to INSERT objects. See README
 * notes for the exact SQL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(safeName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from("media").getPublicUrl(safeName);
  return data.publicUrl;
}
