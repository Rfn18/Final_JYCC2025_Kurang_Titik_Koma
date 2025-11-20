import axios from "axios";
import * as cheerio from "cheerio";

const http = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrapeListEvents() {
  const url = "https://sidita.disbudpar.jatimprov.go.id/event";
  const html = await http.get(url);
  const $ = cheerio.load(html.data);

  const events = [];

  $(".item").each((i, el) => {
    const title = $(el).find("a font").first().text().trim();
    const link = $(el).find("a").first().attr("href");
    const location = $(el)
      .find(".info li")
      .first()
      .text()
      .replace("Kabupaten", "Kab.")
      .trim();

    const dateRange = $(el).find(".info li").eq(1).text().trim();

    if (title && link) {
      events.push({
        title,
        link,
        location,
        dateRange,
      });
    }
  });

  return events;
}

async function scrapeDetailEvent(url) {
  await delay(500); 

  const html = await http.get(url);
  const $ = cheerio.load(html.data);

  const title = $("h3").first().text().trim();
  const location = $(".heading-name p").text().trim();

  const subInfoBlocks = $(".sub-info");

  const tanggalMulaiMentah = $(subInfoBlocks[0]).html().split("<br>")[0].trim();
  const tanggalSelesaiMentah = $(subInfoBlocks[0])
    .html()
    .split("<br>")[1]
    .trim();

  const harga = $(subInfoBlocks[1]).text().trim();
  const skala = $(subInfoBlocks[2]).text().trim();
  const jenis = $(subInfoBlocks[3]).text().trim();
  const kategori = $(subInfoBlocks[4]).text().trim();

  const directionHref = $("a.btn").attr("href") || "";
  const urlParams = new URLSearchParams(directionHref.split("?")[1]);

  const lat = urlParams.get("lat");
  const long = urlParams.get("long");

  const description = $(".isi-ket").text().trim();

  return {
    title,
    location,
    description,
    tanggal_mulai: tanggalMulaiMentah,
    tanggal_selesai: tanggalSelesaiMentah,
    harga,
    skala,
    jenis,
    kategori,
    lat,
    long,
  };
}

async function main() {
  console.log("Mengambil list event...");
  const events = await scrapeListEvents();

  const fullData = [];

  console.log(`Total event ditemukan: ${events.length}\n`);

  for (let ev of events) {
    console.log("Scraping detail:", ev.title);

    const detail = await scrapeDetailEvent(ev.link);

    fullData.push({
      ...ev,
      ...detail,
    });
  }

  console.log("\nHASIL AKHIR:");
  console.log(JSON.stringify(fullData, null, 2));
}

main();
