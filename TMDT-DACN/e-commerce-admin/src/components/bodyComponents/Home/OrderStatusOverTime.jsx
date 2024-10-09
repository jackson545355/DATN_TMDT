import React, { useState, useEffect } from "react";
import { Box, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ApexCharts from "react-apexcharts";

export default function OrderStatusOverTime() {
  const [timeRange, setTimeRange] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const response = await fetch('http://localhost:3003/orders/all');
    const result = await response.json();
    if (result.success) {
      setOrders(result.orders);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000); // Lấy dữ liệu mới mỗi 60 giây
    return () => clearInterval(interval);
  }, []);

  const getOrdersGroupedByStatus = (orders) => {
    const result = {
      pending: [],
      shipping: [],
      completed: [],
      canceled: []
    };

    // Hàm lấy ngày, tháng, năm bỏ giờ, phút, giây
    const getDateOnly = (date) => {
      const d = new Date(date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    orders.forEach(order => {

      // Kiểm tra trạng thái pending
      // Kiểm tra trạng thái canceled
      if (order.updateTime.cancelled) {
        result.canceled.push(order);
      }
      if (order.updateTime.completed) {
        result.completed.push(order);
      }
      if (order.updateTime.shipping) {
        result.shipping.push(order);
      }
      if (order.status === "pending") {
        result.pending.push(order);
      }
    });

    return result;
  };



  const updateChartData = (date) => {
    const now = new Date(date);
    let newCategories = [];
    let seriesData = {
      pending: [],
      shipping: [],
      completed: [],
      canceled: [],
    };

    const { pending, shipping, completed, canceled } = getOrdersGroupedByStatus(orders);

    // Hàm so sánh chỉ dựa trên ngày, tháng, năm
    const isSameDay = (date1, date2) => {
      return (
        date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
      );
    };
    if (timeRange === "week") {
      const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setUTCDate(currentDate.getUTCDate() + i);

        newCategories.push(`${currentDate.toLocaleDateString()}`);

        // Lọc ra các đơn hàng có trạng thái canceled trong ngày hiện tại
        const ordersCanceledOnDay = canceled.filter(order => {
          const createdAt = new Date(order.createdAt);
          return order.status == "cancelled" && isSameDay(createdAt, currentDate); // So sánh ngày với UTC
        });

        // Lọc ra các đơn hàng có trạng thái completed trong ngày hiện tại, nhưng không bị canceled
        const ordersCompletedOnDay = completed.filter(order => {
          const createdAt = new Date(order.createdAt);
          return order.status == "completed" && isSameDay(createdAt, currentDate); // So sánh ngày với UTC và chưa bị hủy
        });

        // Lọc ra các đơn hàng có trạng thái shipping trong ngày hiện tại, nhưng không bị canceled hay completed
        const ordersShippingOnDay = shipping.filter(order => {
          const createdAt = new Date(order.createdAt);
          return order.status == "shipping" && isSameDay(createdAt, currentDate); // So sánh ngày với UTC và chưa completed hoặc hủy
        });

        // Lọc ra các đơn hàng có trạng thái pending trong ngày hiện tại, nhưng không bị canceled, completed hoặc shipping
        const ordersPendingOnDay = pending.filter(order => {
          const createdAt = new Date(order.createdAt);
          return isSameDay(createdAt, currentDate) && order.status == "pending"; // So sánh ngày với UTC và chưa có trạng thái nào khác
        });

        seriesData.canceled.push(ordersCanceledOnDay.length);
        seriesData.completed.push(ordersCompletedOnDay.length);
        seriesData.shipping.push(ordersShippingOnDay.length);
        seriesData.pending.push(ordersPendingOnDay.length);
      }
    } else if (timeRange === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      let currentDate = new Date(startOfMonth);

      while (currentDate <= endOfMonth) {
        newCategories.push(`${currentDate.toLocaleDateString()}`);

        // Lọc ra các đơn hàng có trạng thái pending trong ngày hiện tại
        const ordersPendingOnDay = pending.filter(order => {
          const createdAt = new Date(order.createdAt);
          return isSameDay(createdAt, currentDate); // So sánh ngày với UTC
        });

        // Lọc ra các đơn hàng có trạng thái shipping trong ngày hiện tại
        const ordersShippingOnDay = shipping.filter(order => {
          const createdAt = new Date(order.createdAt);
          return order.status == "shipping" && isSameDay(createdAt, currentDate); // So sánh ngày với UTC
        });

        // Lọc ra các đơn hàng có trạng thái completed trong ngày hiện tại
        const ordersCompletedOnDay = completed.filter(order => {
          const createdAt = new Date(order.createdAt);
          return order.status == "completed" && isSameDay(createdAt, currentDate); // So sánh ngày với UTC
        });

        // Lọc ra các đơn hàng có trạng thái canceled trong ngày hiện tại
        const ordersCanceledOnDay = canceled.filter(order => {
          const createdAt = new Date(order.createdAt);
          return order.status == "cancelled" && isSameDay(createdAt, currentDate); // So sánh ngày với UTC
        });

        seriesData.pending.push(ordersPendingOnDay.length);
        seriesData.shipping.push(ordersShippingOnDay.length);
        seriesData.completed.push(ordersCompletedOnDay.length);
        seriesData.canceled.push(ordersCanceledOnDay.length);

        // Tăng currentDate lên một ngày
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
    } else if (timeRange === "year") {
      for (let i = 0; i < 12; i++) {
        const startOfMonth = new Date(now.getFullYear(), i, 1);
        const endOfMonth = new Date(now.getFullYear(), i + 1, 0);

        newCategories.push(`Tháng ${i + 1}`);

        // Lọc ra các đơn hàng có trạng thái pending trong tháng hiện tại
        const ordersPendingInMonth = pending.filter(order => {
          const createdAt = new Date(order.createdAt);
          return createdAt >= startOfMonth && createdAt <= endOfMonth;
        });

        // Lọc ra các đơn hàng có trạng thái shipping trong tháng hiện tại
        const ordersShippingInMonth = shipping.filter(order => {
          const shippingTime = new Date(order.updateTime.shipping);
          return shippingTime >= startOfMonth && shippingTime <= endOfMonth;
        });

        // Lọc ra các đơn hàng có trạng thái completed trong tháng hiện tại
        const ordersCompletedInMonth = completed.filter(order => {
          const completedTime = new Date(order.updateTime.completed);
          return completedTime >= startOfMonth && completedTime <= endOfMonth;
        });

        // Lọc ra các đơn hàng có trạng thái canceled trong tháng hiện tại
        const ordersCanceledInMonth = canceled.filter(order => {
          const canceledTime = new Date(order.updateTime.canceled);
          return canceledTime >= startOfMonth && canceledTime <= endOfMonth;
        });

        seriesData.pending.push(ordersPendingInMonth.length);
        seriesData.shipping.push(ordersShippingInMonth.length);
        seriesData.completed.push(ordersCompletedInMonth.length);
        seriesData.canceled.push(ordersCanceledInMonth.length);
      }
    }

    setCategories(newCategories);
    setSeries([
      { name: "Pending", data: seriesData.pending },
      { name: "Shipping", data: seriesData.shipping },
      { name: "Completed", data: seriesData.completed },
      { name: "Cancelled", data: seriesData.canceled },
    ]);
    // console.log(seriesData)
  };

  useEffect(() => {
    updateChartData(currentDate);
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
    updateChartData(newDate);
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
    updateChartData(newDate);
  };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      zoom: {
        enabled: true
      }
    },
    title: {
      text: "Order Status Over Time",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'Orders Count'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        endingShape: 'flat'
      },
    },
    fill: {
      opacity: 1
    }
  };

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
        type="bar"
        height={350}
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
