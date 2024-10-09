import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { UilReceipt, UilBox, UilTruck, UilCheckCircle } from "@iconscout/react-unicons";
import InfoCard from "../../subComponents/InfoCard";
import TotalSales from "./TotalSales";
import SalesByCity from "./SalesByCity";
import Channels from "./Channels";
import TopSellingProduct from "./TopSellingProduct";
import OrderStatusOverTime from "./OrderStatusOverTime"; // Biểu đồ trạng thái đơn hàng
import WeekDisplay from "./WeekDisplay";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:3002/products/getAll/');
      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      }
    };

    const fetchOrders = async () => {
      const response = await fetch('http://localhost:3003/orders/all');
      const result = await response.json();
      if (result.success) {
        setOrders(result.orders);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <Box sx={{ margin: 0, padding: 3 }}>
      <Grid container sx={{ marginX: 3, marginBottom: '20px' }}>
        <Grid item md={12}>
          <OrderStatusOverTime orders={orders} />
        </Grid>
      </Grid>

      <Grid container sx={{ marginX: 3 }}>
        <Grid item md={8}>
          <TotalSales orders={orders} />
        </Grid>
        <Grid item md={4}>
          <TopSellingProduct products={products} orders={orders} />
          {/* <Channels chartType="Line Chart" category="Ngày đặt hàng" valueField="Số lượng" functionType="Sum" /> */}
          {/* <Channels chartType="Bar Chart" category="Tên sản phẩm" valueField="Số lượng" functionType="Count" /> */}
          {/* <Channels chartType="Pie Chart" category="Tên phân loại hàng" valueField="Số lượng" functionType="Count" /> */}
          {/* <Channels chartType="Column Chart" category="Tên sản phẩm" valueField="Tổng giá bán (sản phẩm)" functionType="Average" /> */}
          {/* <Channels chartType="Card" category="Người mua" valueField="Tổng giá bán (sản phẩm)" functionType="Sum" /> */}
          {/* <WeekDisplay/>
 */}

        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
