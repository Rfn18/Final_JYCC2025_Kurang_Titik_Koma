import * as Service from "./umkm.service.js";

// CREATE
export async function create(req, res) {
  try {
    const data = await Service.createDestinasi(req.body);
    res.status(201).json({
      message: "Berhasil membuat data UMKM",
      data,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// READ ALL
export async function findAll(req, res) {
  try {
    const data = await Service.getAllDestinasi();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// READ BY ID
export async function findOne(req, res) {
  try {
    const data = await Service.getDestinasiById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// UPDATE
export async function update(req, res) {
  try {
    const data = await Service.updateDestinasi(req.params.id, req.body);
    res.json({
      message: "Berhasil memperbarui data UMKM",
      data,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE
export async function remove(req, res) {
  try {
    await Service.deleteDestinasi(req.params.id);
    res.json({ message: "data UMKM berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
