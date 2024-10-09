import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export default function RevenueGrowthCharts() {
  const [channelData, setChannelData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf("isoWeek"));

  useEffect(() => {
    fetchData();
    fetchPredictedData();
  }, [startDate]);

  const fetchData = async () => {
    const response = await fetch("http://localhost:3003/orders/all");
    const result = await response.json();
    if (result.success) {
      const processedData = processRevenueGrowthData(result.orders, startDate);
      setChannelData(processedData);
    }
  };

  const fetchPredictedData = async () => {
    const response = await fetch("http://localhost:3003/orders/predictRevenue");
    const result = await response.json();
    if (result.success) {
      const processedData = processPredictedData(result.predictedData, startDate);
      setPredictedData(processedData);
    }
  };

  const processRevenueGrowthData = (orders, start) => {
    const data = [];
    const end = start.endOf("isoWeek");
    const today = dayjs(); // Ngày hiện tại
    const daysInRange = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end)) {
      daysInRange.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    daysInRange.forEach((date) => {
      if (dayjs(date).isAfter(today, "day")) {
        // Nếu ngày hiện tại là sau ngày hôm nay, không thêm dữ liệu
        data.push(null);
      } else {
        const revenue = orders
          .filter((order) => dayjs(order.createdAt).isSame(date, "day") && order.status === 'completed')
          .reduce((acc, order) => acc + order.total, 0);
        data.push(revenue);
      }
    });

    return [
      {
        name: "Current Week",
        data: data,
      },
    ];
  };

  const processPredictedData = (predictions, start) => {
    const data = [];
    const end = start.endOf("isoWeek");
    const daysInRange = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
      daysInRange.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    daysInRange.forEach((date) => {
      const prediction = predictions.find((p) => dayjs(p.date).isSame(date, "day"));
      if (prediction && dayjs(date).isAfter(dayjs(), "day")) {
        data.push(prediction.predicted_revenue);
      } else {
        data.push(null);
      }
    });

    return [
      {
        name: "Predicted",
        data: data,
      },
    ];
  };

  const handlePrevious = () => {
    setStartDate(startDate.subtract(1, "week"));
  };

  const handleNext = () => {
    setStartDate(startDate.add(1, "week"));
  };

  const getCategories = () => {
    const categories = [];
    let current = startDate;
    const end = startDate.endOf("isoWeek");
    while (current.isBefore(end) || current.isSame(end)) {
      categories.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return categories;
  };

  const options3 = {
    colors: ["#BF181D", "#0070E0"],
    chart: {
      id: "basic-line",
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetY: 0,
    },
    title: {
      text: "Revenue Growth (Week)",
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: {
        size: 7,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: getCategories(),
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          if (value >= 1e9) return (value / 1e9).toFixed(1) + " Tỷ";
          if (value >= 1e6) return (value / 1e6).toFixed(1) + " Triệu";
          return value;
        },
      },
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
      y: {
        formatter: function (value) {
          if (value >= 1e9) return (value / 1e9).toFixed(1) + " Tỷ";
          if (value >= 1e6) return (value / 1e6).toFixed(1) + " Triệu";
          return value;
        },
      },
    },
  };

  return (
    <Box
      sx={{
        margin: 4,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mx: 3 }}>
        Revenue Growth
      </Typography>

      <ApexCharts
        options={options3}
        series={[...channelData, ...predictedData]}
        type="line"
        width="100%"
        height="320"
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
