import * as Repo from "./destinasi.repository.js";

export async function createDestinasi(body) {
  const { data, error } = await Repo.create(body);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function getAllDestinasi() {
  const { data, error } = await Repo.findAll();

  if (error) throw new Error(error.message);
  return data;
}

export async function getDestinasiById(id) {
  const { data, error } = await Repo.findById(id);

  if (error) throw new Error(error.message);
  return data;
}

export async function updateDestinasi(id, body) {
  const { data, error } = await Repo.update(id, body);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function deleteDestinasi(id) {
  const { error } = await Repo.remove(id);

  if (error) throw new Error(error.message);
  return true;
}
