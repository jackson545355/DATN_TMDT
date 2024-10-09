import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box } from "@mui/material";
import axios from "axios";

export default function BestSelledProductChartBar() {
  const [channelData, setChannelData] = useState([]);
  const [productNames, setProductNames] = useState([]); // Thêm state để quản lý tên sản phẩm

  useEffect(() => {
    fetchProducts();
    return () => {
      setChannelData([]);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3002/products/getAll');
      const products = response.data.products;
      const sortedProducts = products
        .map(product => ({
          name: product.name_product,
          revenue: Math.floor(Math.random() * 500 + 1000), // Giả định doanh thu
          numberSold: product.numberSold
        }))
        .sort((a, b) => b.numberSold - a.numberSold) // Sắp xếp theo số lượng bán ra
        .slice(0, 5); // Lấy 5 sản phẩm bán chạy nhất

      // Cập nhật state
      setChannelData([{ data: sortedProducts.map(item => item.revenue) }]);
      setProductNames(sortedProducts.map(item => item.name));
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const options = {
    colors: ["#5A4FCF", "#FFA500", "#C53500", "#FFBF00", "#FF3659"],
    chart: {
      id: "basic-bar",
      type: "bar",
      stacked: true,
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
      text: "Top 5 Best Selling Products Revenue by Year",
    },
    plotOptions: {
      bar: {
        distributed: true,
        barHeight: "40%",
        horizontal: true,
      },
    },
    xaxis: {
      categories: productNames, // Sử dụng state productNames ở đây
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
