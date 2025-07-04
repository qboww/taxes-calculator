import { useState } from "react";
import { formatHoursWord } from "../../utils/helpers";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import styles from "./StaticCalendar.module.css";

export default function StaticCalendar({ year, month, today }) {
  const [viewYear, setViewYear] = useState(year);
  const [viewMonth, setViewMonth] = useState(month);
  const [selectedDays, setSelectedDays] = useState([]);

  const changeMonth = (delta) => {
    setViewMonth((prevMonth) => {
      let newMonth = prevMonth + delta;
      let newYear = viewYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      setViewYear(newYear);
      return newMonth;
    });

    setSelectedDays([]);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0‑Sun … 6‑Sat
  const monthName = new Date(viewYear, viewMonth).toLocaleString("uk-UA", {
    month: "long",
  });
  const quarter = `Q${Math.floor(viewMonth / 3) + 1}`;

  const workingDays = Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)).filter(
    (date) => date.getDay() !== 0 && date.getDay() !== 6
  ).length;
  const workingHours = workingDays * 8;

  const weeks = [];
  let current = 1 - (firstDay === 0 ? 6 : firstDay - 1);

  for (let w = 0; w < 6; w++) {
    const cells = [];
    let hasContent = false;

    for (let d = 0; d < 7; d++) {
      if (current < 1 || current > daysInMonth) {
        cells.push(<td key={d} />);
      } else {
        const dayNum = current;
        const dow = new Date(viewYear, viewMonth, dayNum).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isSelected = selectedDays.includes(dayNum);
        const isToday =
          today &&
          today.getFullYear() === viewYear &&
          today.getMonth() === viewMonth &&
          today.getDate() === dayNum;

        cells.push(
          <td
            key={d}
            className={`${isWeekend ? styles.weekend : ""} ${
              isSelected ? styles.selected : ""
            } ${isToday ? styles.today : ""}`}
            onClick={() =>
              setSelectedDays((prev) =>
                prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
              )
            }
          >
            {dayNum}
          </td>
        );
        hasContent = true;
      }
      current++;
    }

    if (hasContent) weeks.push(<tr key={w}>{cells}</tr>);
  }

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div className={styles.calendarContainer}>
      <table className={styles.calendar}>
        <thead>
          <tr>
            {weekDays.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>

      {selectedDays.length > 0 && (
        <div className={styles.summary}>
          Вибрано днів: {selectedDays.length} ‑ Годин: {selectedDays.length * 8}
        </div>
      )}

      <div className={styles.controls}>
        <button className={styles.button} onClick={() => changeMonth(-1)}>
          <FaAngleLeft size={20} />
        </button>
        <span>
          {monthName} {viewYear} ({quarter}) {workingHours} {formatHoursWord(workingHours)}
        </span>
        <button className={styles.button} onClick={() => changeMonth(1)}>
          <FaAngleRight size={20} />
        </button>
      </div>

      <hr />
    </div>
  );
}
