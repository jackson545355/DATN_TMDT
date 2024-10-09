import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material";
import { getTopSellingProducts } from "./salesUtils";

export default function TopSellingProduct({ products, orders }) {
  const [timePeriod, setTimePeriod] = useState("month");

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const topSellingProducts = getTopSellingProducts(products, orders, timePeriod);

  return (
    <Box sx={{ margin: 3, bgcolor: "white", borderRadius: 2, padding: 3, height: "95%" }}>
      <Typography variant="h6" fontWeight={"bold"} sx={{ mx: 3 }}>
        Top Selling Products
      </Typography>

      <ButtonGroup sx={{ mx: 3, mb: 3 }}>
        <Button onClick={() => handleTimePeriodChange("day")} variant={timePeriod === "day" ? "contained" : "outlined"}>
          Day
        </Button>
        <Button onClick={() => handleTimePeriodChange("week")} variant={timePeriod === "week" ? "contained" : "outlined"}>
          Week
        </Button>
        <Button onClick={() => handleTimePeriodChange("month")} variant={timePeriod === "month" ? "contained" : "outlined"}>
          Month
        </Button>
      </ButtonGroup>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bolder" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Quantity Sold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topSellingProducts.map((product, id) => (
              <TableRow key={id}>
                <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                  {product.name_product}
                </TableCell>
                <TableCell>{product.price_product}</TableCell>
                <TableCell>{product.quantitySold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
