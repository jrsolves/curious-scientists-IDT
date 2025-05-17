import React, { useState } from 'react';

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const getCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  };

  const isToday = (day) => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const days = getCalendarGrid();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="m-0 p-0 text-center -mt-20">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold mt-[45px]"
        >
          ←
        </button>
        <h2 className="text-xl font-bold">{monthName} {year}</h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold mt-[45px]"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-sm font-medium text-gray-700 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`h-10 flex items-center justify-center rounded ${
              isToday(day) ? 'bg-pink-500 text-white font-bold' : 'text-gray-800'
            }`}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
