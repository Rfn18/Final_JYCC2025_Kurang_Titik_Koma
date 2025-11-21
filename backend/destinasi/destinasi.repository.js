import { supabase } from "../component/supabaseClient.js";

export async function create(data) {
  return await supabase.from("destinasi_wisata").insert([data]).select();
}

export async function findAll() {
  return await supabase.from("destinasi_wisata").select("*");
}

export async function findById(id) {
  return await supabase
    .from("destinasi_wisata")
    .select("*")
    .eq("id", id)
    .single();
}

export async function update(id, data) {
  return await supabase
    .from("destinasi_wisata")
    .update(data)
    .eq("id", id)
    .select();
}

export async function remove(id) {
  return await supabase.from("destinasi_wisata").delete().eq("id", id);
}
