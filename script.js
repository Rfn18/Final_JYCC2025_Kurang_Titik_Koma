const calendarGrid = document.querySelector(".calendar-grid");
const prevBtn = document.getElementById("button-prev");
const nextBtn = document.getElementById("button-next");

const textMonth = document.querySelector(".month");
const textYear = document.querySelector(".year");

const today = new Date();
const todayDate = today.getDate();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

let year = todayYear;
let month = todayMonth;

function formatDateString(year, month, date) {
  const monthStr = String(month + 1).padStart(2, "0");
  const dateStr = String(date).padStart(2, "0");
  return `${year}-${monthStr}-${dateStr}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

async function getEventsByDate(dateString) {
  try {
    const response = await fetch(`http://localhost:3000/events/${dateString}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Gagal mengambil data event:", err);
    return [];
  }
}

async function getEventsByMonth(year, month) {
  try {
    const monthString = String(month + 1).padStart(2, "0");

    const res = await fetch(
      `http://localhost:3000/events/month/${year}/${monthString}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Gagal mengambil data event bulan ini:", err);
    return [];
  }
}

function getEventColor(eventDateString) {
  const eventDate = new Date(eventDateString);

  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) return "red";
  if (diffDays <= 7) return "yellow";
  return "purple";
}

function createEventItem(event) {
  const color = getEventColor(event.tanggal_mulai);

  return `
    <div class="event-item">
        <div class="event-date ${color}">${new Date(
    event.tanggal_mulai
  ).getDate()}</div>

        <div class="event-timeline ${color}">
            <div class="circle ${color}"></div>
            <div class="line ${color}"></div>
            <div class="circle ${color}"></div>
        </div>

        <div class="event-details">
            <div class="event-name">${event.nama_event}</div>

            <div class="event-info">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ${event.location ?? "-"}
            </div>

            <div class="event-info">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${event.jam_mulai} - ${event.jam_selesai}
            </div>

            <div class="event-price">Harga Tiket <strong>${
              event.harga_tiket
            }</strong></div>
        </div>
    </div>
  `;
}

async function renderEventList(year, month) {
  const wrapper = document.querySelector(".event-list-wrapper");
  wrapper.innerHTML = `<p class="loading">Memuat event...</p>`;
  const events = await getEventsByMonth(year, month);
  wrapper.innerHTML = "";

  if (events.length === 0) {
    wrapper.innerHTML = `<p class="no-events">Tidak ada event bulan ini.</p>`;
    return;
  }

  events.forEach((ev) => {
    wrapper.innerHTML += createEventItem(ev);
  });
}

async function renderCalendar() {
  console.log("Render kalender:", year, month);

  calendarGrid.innerHTML = "";
  textMonth.innerHTML = monthNames[month];
  textYear.innerHTML = year;

  const events = await getEventsByMonth(year, month);

  const eventMap = {};
  events.forEach((ev) => {
    const day = new Date(ev.tanggal_mulai).getDate();
    if (!eventMap[day]) eventMap[day] = [];
    eventMap[day].push(ev);
  });

  const days = [];

  const totalDays = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const prevMonthDays = getDaysInMonth(year, month - 1);

  for (let i = 0; i < 42; i++) {
    const dayNumber = i - firstDay + 1;
    let date, type;

    if (dayNumber < 1) {
      date = prevMonthDays + dayNumber;
      type = "prev";
    } else if (dayNumber > totalDays) {
      date = dayNumber - totalDays;
      type = "next";
    } else {
      date = dayNumber;
      type = "current";
    }

    days.push({ date, type });
  }

  for (const day of days) {
    const div = document.createElement("div");
    div.classList.add("day-cell");

    if (day.type !== "current") {
      div.classList.add("other-month");
    }

    if (
      day.type === "current" &&
      day.date === todayDate &&
      month === todayMonth &&
      year === todayYear
    ) {
      div.classList.add("today");
    }

    const num = document.createElement("div");
    num.classList.add("day-number");
    num.textContent = day.date;
    div.appendChild(num);

    if (day.type === "current" && eventMap[day.date]) {
      const count = eventMap[day.date].length;

      const indicator = document.createElement("div");
      indicator.classList.add("event-indicator");

      const firstEvent = eventMap[day.date][0];
      const color = getEventColor(firstEvent.tanggal_mulai);

      console.log(
        "Warna indikator untuk tanggal",
        firstEvent.tanggal_mulai,
        "adalah",
        color
      );

      indicator.classList.add(color);
      indicator.textContent = `${count} Event`;

      div.appendChild(indicator);
    }

    calendarGrid.appendChild(div);
  }
}

nextBtn.addEventListener("click", async () => {
  month++;

  if (month > 11) {
    month = 0;
    year++;
  }

  await renderCalendar();
  await renderEventList(year, month);
});

prevBtn.addEventListener("click", async () => {
  month--;

  if (month < 0) {
    month = 11;
    year--;
  }

  await renderCalendar();
  await renderEventList(year, month);
});

renderCalendar();
renderEventList(year, month);
