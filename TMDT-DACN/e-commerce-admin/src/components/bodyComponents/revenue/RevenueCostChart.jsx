import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { Box } from "@mui/material";

export default function RevenueCostChart() {
  const [channelData, setChannelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3003/orders/all');
        if (response.data && response.data.orders) {
          const orders = response.data.orders;
          calculateChartData(orders);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      setChannelData([]);
    };
  }, []);

  const calculateChartData = (orders) => {
    let monthlyRevenue = new Array(12).fill(0);
    let monthlyCost = new Array(12).fill(0);
  
    orders.forEach(order => {
      if (order.status === "completed") {
        const monthIndex = order.month - 1; // month in data is 1-indexed
        monthlyRevenue[monthIndex] += order.total;
        monthlyCost[monthIndex] += order.total * 0.70; // Cost is 70% of the revenue
      }
    });
  
    setChannelData([
      {
        name: "Revenue",
        type: "column",
        data: monthlyRevenue.map(formatNumber)
      },
      {
        name: "Cost",
        type: "column",
        data: monthlyCost.map(formatNumber)
      }
    ]);
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toString();
    }
  };

  const options = {
    colors: ["#00D100", "#FF2E2E"],
    chart: {
      id: "basic-bar",
      type: "bar",
      stacked: false,
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
      text: "Cost & Revenue over Year",
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        horizontal: false,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aut", "Spt", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return formatNumber(parseFloat(val));
        }
      }
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft", // can be topLeft, topRight, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
    },
  };

  return (
    <Box
      sx={{
        marginX: 4,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <ApexCharts
        options={options}
        series={channelData}
        type="bar"
        width="100%"
        height="320"
      />
    </Box>
  );
}
