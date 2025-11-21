import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function extractTime(str) {
  if (!str) return null;
  const clean = str.replace("WIB", "").replace("s/d", "").trim();
  const timeMatch = clean.match(/\d{2}:\d{2}/);

  if (!timeMatch) return null;
  return timeMatch[0] + ":00";
}

function extractDate(str) {
  if (!str) return null;

  // bersihkan string
  const clean = str.replace("WIB", "").replace("s/d", "").trim();

  // ambil bagian tanggal: "01 Oct 2025"
  const match = clean.match(/\d{1,2}\s\w{3}\s\d{4}/);
  if (!match) return null;

  // konversi ke YYYY-MM-DD
  const date = new Date(match[0]);

  if (isNaN(date.getTime())) return null;

  // format ke yyyy-mm-dd
  return date.toISOString().split("T")[0];
}

const http = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  },
});

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrapeListEvents(page) {
  const url = `https://sidita.disbudpar.jatimprov.go.id/event?page=${page}`;
  const html = await http.get(url);
  const $ = cheerio.load(html.data);

  const results = [];

  $(".item").each((i, el) => {
    const link = $(el).find("a").first().attr("href");
    const title = $(el).find("a font").first().text().trim();

    if (link) {
      results.push({
        title,
        link,
      });
    }
  });

  return results;
}

async function scrapeDetailEvent(url) {
  await delay(300); // biar aman dari rate limit

  const html = await http.get(url);
  const $ = cheerio.load(html.data);

  const nama_event = $("h3").first().text().trim();
  const location = $(".heading-name p").text().trim();

  const subInfo = $(".sub-info");
  const tanggal_mulai = $(subInfo[0]).html().split("<br>")[0].trim();
  const tanggal_selesai = $(subInfo[0]).html().split("<br>")[1].trim();
  const harga_tiket = $(subInfo[1]).text().trim();

  const directionHref = $("a.btn").attr("href") || "";
  const urlParams = new URLSearchParams(directionHref.split("?")[1] || "");
  const latitude = urlParams.get("lat");
  const longitude = urlParams.get("long");

  const description = $(".isi-ket").text().trim();

  const jam_mulai = extractTime(tanggal_mulai);
  const jam_selesai = extractTime(tanggal_selesai);

  const tanggal_mulai_clean = extractDate(tanggal_mulai);
  const tanggal_selesai_clean = extractDate(tanggal_selesai);

  return {
    nama_event,
    location,
    jam_mulai,
    jam_selesai,
    tanggal_mulai: tanggal_mulai_clean,
    tanggal_selesai: tanggal_selesai_clean,
    harga_tiket,
    latitude,
    longitude,
    description,
  };
}

async function saveToSupabase(eventData) {
  const { data, error } = await supabase.from("events").insert(eventData);

  if (error) {
    console.error("Gagal insert:", error);
  } else {
    console.log("Berhasil insert:", data);
  }
}

async function main() {
  const pages = [156, 157, 158];
  let links = [];

  for (const p of pages) {
    console.log(`Scraping pagination page: ${p}`);
    const events = await scrapeListEvents(p);
    links = links.concat(events);
  }

  console.log(`Total link event ditemukan: ${links.length}`);

  let finalData = [];

  for (const ev of links) {
    console.log("Scraping detail:", ev.title);
    const detail = await scrapeDetailEvent(ev.link);

    const { link, title, ...eventData } = {
      ...ev,
      ...detail,
    };

    finalData.push(eventData);

    await saveToSupabase(eventData);
  }

  console.log("\nHASIL AKHIR:");
  console.log(JSON.stringify(finalData, null, 2));
}

main();
