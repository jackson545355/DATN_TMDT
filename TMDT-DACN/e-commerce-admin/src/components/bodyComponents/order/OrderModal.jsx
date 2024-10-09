import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";

export default function OrderModal({ order, onUpdateOrderStatus }) {
  const [status, setStatus] = useState(order.status);

  const handleUpdateOrderStatus = async (newStatus) => {
    try {
      const response = await fetch("http://localhost:3003/orders/updateOrderStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus(newStatus);
        onUpdateOrderStatus(order.id, newStatus); // Update status in parent component
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const tableRows = order.products.map((orderProduct, index) => (
    <TableRow key={index}>
      <TableCell>{orderProduct.productName}</TableCell>
      <TableCell>{orderProduct.colors}</TableCell>
      <TableCell>{orderProduct.stock}</TableCell>
    </TableRow>
  ));

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}
    >
      <Box sx={{ color: "black", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ m: 3 }}>
          Order Details
        </Typography>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            m: 3,
          }}
        >
          <Box sx={{ display: "flex", gap:"35px", width: "100%" }}>
            <Typography variant="subtitle1">Order ID:</Typography>
            <Typography variant="subtitle1" color={"grey"}>
              {order.id}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap:"15px", width: "100%" }}>
            <Typography variant="subtitle1">User Name:</Typography>
            <Typography variant="subtitle1" color={"grey"}>
              {order.user}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap:"50px", width: "100%" }}>
            <Typography variant="subtitle1">Phone:</Typography>
            <Typography variant="subtitle1" color={"grey"}>
              {order.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap:"35px", width: "100%" }}>
            <Typography variant="subtitle1">Address:</Typography>
            <Typography variant="subtitle1" color={"grey"}>
              {order.address}
            </Typography>
          </Box>
        </Paper>
        <Box>
          <TableContainer sx={{ marginBottom: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              m: 0,
            }}
          >
            {status === "pending" && (
              <Button
                variant="contained"
                sx={{ bgcolor: "#504099", m: 3, px: 12 }}
                onClick={() => handleUpdateOrderStatus("shipping")}
              >
                Approve
              </Button>
            )}
            {status === "shipping" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#504099", m: 3, px: 12 }}
                  onClick={() => handleUpdateOrderStatus("completed")}
                >
                  Complete
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#ff4040", m: 3, px: 12 }}
                  onClick={() => handleUpdateOrderStatus("cancelled")}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
