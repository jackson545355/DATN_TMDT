import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

export default function SalesGrowthCharts() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchSalesGrowthData = async () => {
      const response = await fetch('http://localhost:3003/orders/all');
      const result = await response.json();
      if (result.success) {
        // Phân tích dữ liệu từ API để tạo series cho biểu đồ
        const monthlySales = Array(12).fill(0);
        result.orders.forEach(order => {
          const month = new Date(order.createdAt).getMonth();
          monthlySales[month] += order.total;
        });

        setSeries([{ name: "Revenue", type: "column", data: monthlySales }]);
      }
    };

    fetchSalesGrowthData();

    return () => {
      setSeries([]);
    };
  }, []);

  const options = {
    chart: {
      id: "basic-bar",
      type: "bar",
      stacked: false, //one on top of another
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetY: 0,
    },
    title: {
      text: "Sales Growth Over The Year",
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        horizontal: false,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
    },
  };

  return (
    <Box sx={{ marginX: 4, bgcolor: "white", borderRadius: 2, padding: 3, height: "100%" }}>
      <ApexCharts options={options} series={series} height={300} type="bar" width="100%" />
    </Box>
  );
}
