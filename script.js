const calendarGrid = document.querySelector(".calendar-grid");

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const days = [];
const year = 2025,
  month = 3;

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

  const div2 = document.createElement("div");
  div2.classList.add("day-number");
  div2.textContent = day.date;

  div.appendChild(div2);
  calendarGrid.appendChild(div);
}

