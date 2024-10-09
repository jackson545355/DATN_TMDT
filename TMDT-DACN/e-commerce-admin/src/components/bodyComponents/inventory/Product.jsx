import { Typography } from "@mui/material";
//import React from "react";

export default function Product({ productName }) {
  return (
    <Typography sx={{ mx: 3 }} variant="subtitle2">
      {productName}
    </Typography>
  );
}
