import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { supabase } from "./component/supabaseClient.js";
import destinasiRoutes from "./routes/destinasi.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get("/events", async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: "year & month wajib diisi" });
  }

  const mm = String(month).padStart(2, "0");

  const start = `${year}-${mm}-01`;
  const end = `${year}-${mm}-31`;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error) return res.status(500).json({ error });

  res.json(data);
});

app.get("/events/:tanggal_mulai", async (req, res) => {
  const { tanggal_mulai } = req.params;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("tanggal_mulai", tanggal_mulai);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

app.post("/events", async (req, res) => {
  const {
    nama_event,
    lokasi,
    jam_mulai,
    jam_selesai,
    tanggal,
    no_wa,
    email,
    harga_tiket,
  } = req.body;

  if (!nama_event || !tanggal) {
    return res.status(400).json({ error: "Nama event & tanggal wajib diisi" });
  }

  const finalHarga = harga_tiket ? harga_tiket : "Free";

  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        nama_event,
        lokasi,
        jam_mulai,
        jam_selesai,
        tanggal,
        no_wa,
        email,
        harga_tiket: finalHarga,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  res.status(201).json(data);
});

app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return res.status(500).json({ error });

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});

app.get("/events/month/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  const monthString = String(month).padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();

  const start = `${year}-${monthString}-01`;
  const end = `${year}-${monthString}-${lastDay}`;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("tanggal_mulai", start)
    .lte("tanggal_mulai", end)
    .order("tanggal_mulai", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});
app.get("/events/date/:year/:month/:day", async (req, res) => {
  const { year, month, day } = req.params;

  const monthString = String(month).padStart(2, "0");
  const dayString = String(day).padStart(2, "0");

  const targetDate = `${year}-${monthString}-${dayString}`;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("tanggal_mulai", targetDate)
    .lte("tanggal_selesai", targetDate)
    .order("tanggal_mulai", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

app.use("/api/destinasi", destinasiRoutes);
