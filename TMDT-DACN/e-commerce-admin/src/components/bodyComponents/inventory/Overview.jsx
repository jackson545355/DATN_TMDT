import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

export default function Overview() {
  const [data, setData] = useState({
    totalProducts: 0,
    totalSold: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3002/products/getAll");
        const result = await response.json();
        if (result.success) {
          const totalProducts = result.products.length;
          const totalSold = result.products.reduce((acc, product) => acc + product.numberSold, 0);
          setData({ totalProducts, totalSold });
        }
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metrics</TableCell>
              <TableCell align="right">Values</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Total Products</TableCell>
              <TableCell align="right">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {data.totalProducts}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Sold</TableCell>
              <TableCell align="right">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {data.totalSold}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
