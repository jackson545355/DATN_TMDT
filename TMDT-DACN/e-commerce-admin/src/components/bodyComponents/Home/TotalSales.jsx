import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

export default function TotalSales({ orders }) {
  const [timeRange, setTimeRange] = useState("week");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateFilteredOrders = (date) => {
    const now = new Date(date);
    let filtered = [];
    let categories = [];

    if (timeRange === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return order.status === 'completed' && orderDate >= startOfMonth && orderDate <= endOfMonth;
      });

      let current = new Date(startOfMonth);
      while (current <= endOfMonth) {
        let weekStart = new Date(current);
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > endOfMonth) weekEnd = endOfMonth; // Đảm bảo không vượt quá ngày cuối tháng
        categories.push(`${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`);
        current.setDate(current.getDate() + 7);
      }
    } else if (timeRange === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);
      filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return order.status === 'completed' && orderDate >= startOfYear && orderDate <= endOfYear;
      });

      for (let i = 0; i < 12; i++) {
        categories.push(`Tháng ${i + 1}`);
      }
    } else {
      // Default to "week"
      const startOfWeek = new Date(now); // Tạo bản sao của now
      startOfWeek.setDate(now.getDate() - now.getDay()); // Tính ngày bắt đầu của tuần
      const endOfWeek = new Date(startOfWeek); // Tạo một bản sao của startOfWeek
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Tính ngày kết thúc của tuần

      filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);

        // So sánh chỉ ngày tháng năm của orderDate với startOfWeek và endOfWeek
        const isWithinWeek = (
          orderDate.getUTCFullYear() === startOfWeek.getUTCFullYear() &&
          orderDate.getUTCMonth() === startOfWeek.getUTCMonth() &&
          orderDate.getUTCDate() >= startOfWeek.getUTCDate() &&

          orderDate.getUTCFullYear() === endOfWeek.getUTCFullYear() &&
          orderDate.getUTCMonth() === endOfWeek.getUTCMonth() &&
          orderDate.getUTCDate() <= endOfWeek.getUTCDate()
        );
        return order.status === 'completed'  && isWithinWeek;
      });

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 0; i < 7; i++) {
        categories.push(days[i]); // Thêm từng ngày từ Chủ nhật đến Thứ bảy vào categories
      }

    }

    setFilteredOrders(filtered);
    setCategories(categories);
  };



  useEffect(() => {
    updateFilteredOrders(currentDate);
  }, [timeRange, currentDate, orders]);

  const handlePrevious = () => {
    let newDate = new Date(currentDate);
    if (timeRange === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (timeRange === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (timeRange === "year") {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    let newDate = new Date(currentDate);
    if (timeRange === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (timeRange === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (timeRange === "year") {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const options = {
    title: {
      text: "Total Sales (Triệu VND)",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    subtitle: {
      text: `Sales over ${timeRange}`,
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
      fontFamily: "Helvetica, Arial",
      offsetY: -20,
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 9,
      },
    },
    theme: {
      mode: "light",
    },
    chart: {
      height: 328,
      type: "line",
      zoom: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.2,
      },
    },
    xaxis: {
      categories: categories,
    },
  };

  const series = [
    {
      type: "line",
      name: "Sales",
      data: categories.map((category, index) => {
        if (timeRange === "week") {
          // Tạo bản sao của currentDate
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + index); // Lấy đúng ngày từ Chủ nhật đến Thứ bảy

          const day = startOfWeek.getUTCDate();
          const month = startOfWeek.getUTCMonth();
          const year = startOfWeek.getUTCFullYear();

          // Lọc các đơn hàng dựa trên ngày tháng năm
          const salesForDay = filteredOrders
            .filter(order => {
              const orderDate = new Date(order.createdAt);
              return (
                orderDate.getUTCFullYear() === year && // So sánh năm
                orderDate.getUTCMonth() === month && // So sánh tháng
                orderDate.getUTCDate() === day && // So sánh ngày
                order.status === "completed"  // Đơn hàng đã hoàn tất
              );
            })
            .reduce((total, order) => total + order.total / 1000, 0); // Tính tổng doanh thu

          return salesForDay.toFixed(2); // Trả về doanh thu cho ngày
        } else if (timeRange === "month") {
          const weekIndex = categories.indexOf(category);
          const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), weekIndex * 7 + 1);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          return filteredOrders
            .filter(order => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= weekStart && orderDate <= weekEnd;
            })
            .reduce((total, order) => total + order.total / 1000, 0).toFixed(2);
        } else if (timeRange === "year") {
          const monthIndex = categories.indexOf(category);
          return filteredOrders
            .filter(order => new Date(order.createdAt).getMonth() === monthIndex)
            .reduce((total, order) => total + order.total / 1000, 0).toFixed(2);
        }
        return 0;
      }),
    },
  ];


  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Chú thích: Tất cả các giá trị đều tính theo đơn vị triệu VND
      </Typography>
      <FormControl sx={{ marginBottom: 2 }}>
        <InputLabel id="time-range-label">Time Range</InputLabel>
        <Select
          labelId="time-range-label"
          value={timeRange}
          label="Time Range"
          onChange={(e) => setTimeRange(e.target.value)}
          sx={{ height: '50px', width: '150px' }}
        >
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FormControl>
      <ApexCharts
        options={options}
        series={series}
        height={300}
        type="line"
        width="100%"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button
          onClick={handlePrevious}
          sx={{
            borderRadius: '10%',
            height: '25px',
            '&:hover': {
              backgroundColor: '#f0f0f0', // Màu khi hover
            },
            '&:active': {
              backgroundColor: '#d0d0d0', // Màu khi click
            },
          }}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          sx={{
            borderRadius: '10%',
            height: '25px',
            '&:hover': {
              backgroundColor: '#f0f0f0', // Màu khi hover
            },
            '&:active': {
              backgroundColor: '#d0d0d0', // Màu khi click
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
