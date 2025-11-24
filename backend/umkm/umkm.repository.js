import { supabase } from "../component/supabaseClient.js";

export async function create(data) {
  return await supabase.from("umkms").insert([data]).select();
}

export async function findAll() {
  return await supabase.from("umkms").select("*");
}

export async function findById(id) {
  return await supabase.from("umkms").select("*").eq("id", id).single();
}

export async function update(id, data) {
  return await supabase.from("umkms").update(data).eq("id", id).select();
}

export async function remove(id) {
  return await supabase.from("umkms").delete().eq("id", id);
}
