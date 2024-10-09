import React from "react";
import { Box } from "@mui/material";
import ApexCharts from "react-apexcharts";

export default function SalesByCity({ orders }) {
  const cities = ["Oujda", "Nador", "Berkan", "Casablanca"];
  const citySales = cities.map(city => orders.filter(order => order.address.includes(city)).length);

  const donutOption = {
    labels: cities,
    legend: {
      position: "right",
      fontSize: "14",
    },
    title: {
      text: "Sales By City",
    },
  };

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "100%",
      }}
    >
      <ApexCharts
        options={donutOption}
        series={citySales}
        type="pie"
        width="100%"
      />
    </Box>
  );
}
