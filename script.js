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

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function renderCalendar() {
  console.log("Render kalender:", year, month);

  calendarGrid.innerHTML = "";
  textMonth.innerHTML = monthNames[month];
  textYear.innerHTML = year;

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
    calendarGrid.appendChild(div);
  }
}

nextBtn.addEventListener("click", () => {
  month++;

  if (month > 11) {
    month = 0;
    year++;
  }

  renderCalendar();
});

prevBtn.addEventListener("click", () => {
  month--;

  if (month < 0) {
    month = 11;
    year--;
  }

  renderCalendar();
});

renderCalendar();
