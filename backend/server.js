import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

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

app.get("/events/:date", async (req, res) => {
  const { date } = req.params;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("date", date);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

app.post("/events", async (req, res) => {
  const { title, description, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "title & date wajib" });
  }

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
        harga_tiket,
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
