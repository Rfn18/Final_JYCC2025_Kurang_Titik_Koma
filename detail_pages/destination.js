const API_BASE_URL = "http://localhost:3000";

/* ---------------------- Haversine Distance ---------------------- */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------------------- API Calls ---------------------- */
async function getDestinasi(id) {
  const response = await fetch(`${API_BASE_URL}/api/destinasi/${id}`);
  if (!response.ok)
    throw new Error(`Destinasi dengan ID ${id} tidak ditemukan`);
  return response.json();
}

async function getEventsByMonth(year, month) {
  const response = await fetch(`${API_BASE_URL}/events/month/${year}/${month}`);
  if (!response.ok)
    throw new Error(`Gagal mengambil events untuk ${month}/${year}`);
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}

/* ---------------------- Utilities ---------------------- */
function extractCoordinates(obj) {
  return { lat: obj.latitude, lon: obj.longitude };
}

function extractName(obj) {
  return obj.nama_destinasi || obj.nama_event || "Nama tidak tersedia";
}

function findNearestEvents(destinasi, events) {
  const destCoords = extractCoordinates(destinasi);

  return events
    .map((event) => {
      const eventCoords = extractCoordinates(event);
      if (isNaN(eventCoords.lat) || isNaN(eventCoords.lon)) return null;

      const distance = haversineDistance(
        destCoords.lat,
        destCoords.lon,
        eventCoords.lat,
        eventCoords.lon
      );

      return { ...event, distance_km: Math.round(distance * 100) / 100 };
    })
    .filter((e) => e !== null)
    .sort((a, b) => a.distance_km - b.distance_km);
}

function findEventsWithinRadius(destinasi, events, radiusKm) {
  return findNearestEvents(destinasi, events).filter(
    (event) => event.distance_km <= radiusKm
  );
}

function fillFields(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    if ("value" in el) el.value = value;
    else el.textContent = value;
  });
}

/* ---------------------- Render Event Cards ---------------------- */
function renderEventCards(events) {
  const wrapper = document.querySelector(".card-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = "";

  if (!events || events.length === 0) {
    wrapper.innerHTML = `<div class="event-desc">Belum ada event di sekitar destinasi.</div>`;
    return;
  }

  events.forEach((event, index) => {
    const card = `
      <div class="event-card">
        <div class="event-name-wrapper">
            <div class="event-name">${extractName(event)}</div>
            <a href="#" class="event-link">Lihat Detail</a>
        </div>

        <div class="event-desc">
          ${event.description || event.deskripsi || "Tidak ada deskripsi"}
        </div>

        <div class="event-price-wrapper">
            <div class="event-price-label">Jarak :</div>
            <div class="event-price">${event.distance_km} km</div>
        </div>
      </div>
    `;

    wrapper.insertAdjacentHTML("beforeend", card);
  });
}

/* ---------------------- Load Detail (AWAL) ---------------------- */
async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.body.innerHTML = "<h3>ID tidak ditemukan di URL</h3>";
    return;
  }

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [destinasi, events] = await Promise.all([
      getDestinasi(id),
      getEventsByMonth(year, month),
    ]);

    window.destinasiData = destinasi;

    fillFields(".nama_destinasi", destinasi.nama_destinasi);
    fillFields(".harga_tiket", destinasi.harga_tiket);
    fillFields(".alamat", destinasi.alamat);
    fillFields(".jam_buka", destinasi.jam_buka);

    document.getElementById("fasilitas").innerText =
      destinasi.fasilitas?.fasilitas || "-";

    const nearestEvents = findEventsWithinRadius(destinasi, events, 30);
    renderEventCards(nearestEvents);

    return { destinasi, events, nearestEvents };
  } catch (err) {
    console.error("Error:", err);
    document.body.innerHTML = "<h3>Error mengambil data</h3>";
  }
}

loadDetail();

function generateDateButtons() {
  const container = document.getElementById("date-buttons");
  if (!container) return;

  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  for (let i = 0; i < 8; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const btn = document.createElement("button");
    btn.classList.add("date-btn");

    btn.dataset.year = date.getFullYear();
    btn.dataset.month = date.getMonth() + 1;
    btn.dataset.day = date.getDate();

    btn.innerHTML = `
      <span class="day">${i === 0 ? "Hari ini" : days[date.getDay()]}</span>
      <span class="date">${date.getDate()} ${months[date.getMonth()]}</span>
    `;

    container.appendChild(btn);
  }
}

generateDateButtons();

async function getEventsByDate(year, month, day) {
  const response = await fetch(
    `${API_BASE_URL}/events/date/${year}/${month}/${day}`
  );

  if (!response.ok)
    throw new Error("Gagal mengambil event berdasarkan tanggal");

  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
}
document.addEventListener("click", async function (e) {
  const btn = e.target.closest(".date-btn");
  if (!btn) return;

  const year = Number(btn.dataset.year);
  const month = Number(btn.dataset.month);
  const day = Number(btn.dataset.day);

  const events = await getEventsByDate(year, month, day);

  const nearest = findEventsWithinRadius(window.destinasiData, events, 30);

  renderEventCards(nearest);
});

document.getElementById("calendar_event")?.addEventListener("click", () => {
  location.href = "../index.html";
});
