import React, { useState } from 'react';

// Hàm để lấy thứ hai của tuần hiện tại
const getMonday = (date) => {
  const day = date.getDay(),
        diff = date.getDate() - day + (day === 0 ? -6 : 1); // Nếu là Chủ nhật (day === 0) thì lùi 6 ngày
  return new Date(date.setDate(diff));
};

// Hàm định dạng ngày
const formatDate = (date) => {
  return date.toISOString().slice(0, 10); // Định dạng YYYY-MM-DD
};

// Hàm để hiển thị tất cả các ngày trong tháng
const getMonthDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // Ngày cuối cùng của tháng

  const days = [];
  for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i);
    days.push(formatDate(day));
  }

  return days;
};

// Component chính
const WeekDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMode, setDisplayMode] = useState('week'); // 'week' hoặc 'month'

  // Hiển thị tuần từ thứ 2 đến Chủ nhật
  const displayWeek = (date) => {
    const monday = getMonday(new Date(date));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(formatDate(day));
    }
    return week;
  };

  // Chuyển tuần hoặc tháng: direction = 1 (tuần/tháng sau), -1 (tuần/tháng trước)
  const changeDate = (direction) => {
    const newDate = new Date(currentDate);

    if (displayMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else if (displayMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    }

    setCurrentDate(newDate);
  };

  // Hàm để hiển thị ngày theo tuần hoặc tháng
  const currentDays = displayMode === 'week' ? displayWeek(currentDate) : getMonthDays(currentDate);

  return (
    <div>
      <h2>
        {displayMode === 'week'
          ? `Week from ${currentDays[0]} to ${currentDays[currentDays.length - 1]}`
          : `Month: ${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`}
      </h2>

      <div>
        <button onClick={() => changeDate(-1)}>Previous {displayMode === 'week' ? 'Week' : 'Month'}</button>
        <button onClick={() => changeDate(1)}>Next {displayMode === 'week' ? 'Week' : 'Month'}</button>
        <button onClick={() => setDisplayMode(displayMode === 'week' ? 'month' : 'week')}>
          Switch to {displayMode === 'week' ? 'Month' : 'Week'} View
        </button>
      </div>

      <ul>
        {currentDays.map((day, index) => (
          <li key={index}>{day}</li>
        ))}
      </ul>
    </div>
  );
};

export default WeekDisplay;
