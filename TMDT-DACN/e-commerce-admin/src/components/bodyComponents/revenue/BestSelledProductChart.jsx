import React, { useEffect, useState } from "react";
import Axios from "axios";
import ApexCharts from "react-apexcharts";
import { Box, TextField, Button } from "@mui/material";

export default function BestSelledProductChart() {
  const [channelData, setChannelData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = () => {
    Axios.get('http://localhost:3003/orders/all')
      .then(response => {
        const orders = response.data.orders;

        // Lọc đơn hàng theo khung thời gian
        const filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });

        // Tạo một object để đếm số lượng bán cho từng sản phẩm
        const salesData = {};

        filteredOrders.forEach(order => {
          order.products.forEach(product => {
            const productId = product.product;
            if (!salesData[productId]) {
              salesData[productId] = { productId: productId, data: Array(7).fill(0), numberSold: 0 };
            }
            const orderDate = new Date(order.createdAt);
            const day = orderDate.getDay(); // Lấy ngày trong tuần từ 0 (Chủ Nhật) đến 6 (Thứ Bảy)
            salesData[productId].data[day] += product.stock;
            salesData[productId].numberSold += product.stock;
          });
        });

        // Lấy thông tin sản phẩm từ API
        Axios.get('http://localhost:3002/products/getAll')
          .then(productResponse => {
            const products = productResponse.data.products;

            // Thêm tên sản phẩm vào salesData
            const salesDataArray = Object.values(salesData).map(item => {
              const product = products.find(p => p._id === item.productId);
              return {
                ...item,
                name: product ? product.name_product : 'Unknown Product'
              };
            });

            // Sắp xếp sản phẩm theo số lượng bán ra
            const sortedProducts = salesDataArray.sort((a, b) => b.numberSold - a.numberSold);
            // Lấy 5 sản phẩm bán chạy nhất
            const topProducts = sortedProducts.slice(0, 5);
            setChannelData(topProducts);
          })
          .catch(error => {
            console.error('Error fetching product data: ', error);
          });
      })
      .catch(error => {
        console.error('Error fetching order data: ', error);
      });

    return () => {
      setChannelData([]);
    };
  };

  const handleFetchData = () => {
    if (startDate && endDate) {
      fetchData();
    } else {
      alert("Please select a start date and end date.");
    }
  };

  const options = {
    chart: {
      id: "basic-bar",
      type: "bar",
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
      text: "Top 5 Best Selling Products",
    },
    plotOptions: {
      bar: {
        columnWidth: "15%",
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        size: 7,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" onClick={handleFetchData}>Fetch Data</Button>
      </Box>
      <ApexCharts
        options={options}
        series={channelData.map(item => ({ name: item.name, data: item.data }))}
        type="line"
        width="100%"
        height="320"
      />
    </Box>
  );
}
