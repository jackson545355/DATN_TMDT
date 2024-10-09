import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import ApexCharts from "react-apexcharts";

const Visualization = ({
  viz,
  index,
  data,
  handleRemove,
  // orders, productsData, calculateVisualizationData
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // console.log(viz);
  // if (viz.type.include('Chart')){
  //   generateChartOptions(viz);
  // }
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMaximize = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Grid item xs={12} sm={6} md={3 * viz.width}>
      <Box bgcolor={"white"} sx={{ margin: 3, borderRadius: 2 }}>
        {/* Visualization Header */}
        <Box display="flex" justifyContent="center" alignItems="center" p={1}>
          <Box sx={{ width: "48px" }} />
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            {" "}
            {/* Đảm bảo tiêu đề ở giữa */}
            <h1>{viz.title}</h1>
          </Box>
          <IconButton aria-label="more" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {/* <MenuItem onClick={handleMaximize}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              {isFullscreen ? "Restore" : "Maximize"}
            </MenuItem> */}
            <MenuItem onClick={handleCollapse}>
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              {isCollapsed ? "Expand" : "Collapse"}
              {/* {console.log(isCollapsed)} */}
            </MenuItem>
            {/* <MenuItem onClick={() => handleRemove(index)}>
              <DeleteIcon />
              Remove
            </MenuItem> */}
          </Menu>
        </Box>

        {/* Visualization Content */}
        {!isCollapsed && (
          <Box
            p={2}
            sx={{
              height: viz.type === "Card" ? 50 : 350,
              width: "100%",
              display: viz.type === "Card" ? "flex" : "block", // Chỉ "flex" nếu là Card, mặc định là "block" cho các loại khác
              justifyContent: viz.type === "Card" ? "center" : "initial", // Chỉ "center" nếu là Card
              alignItems: viz.type === "Card" ? "center" : "initial", // Chỉ "center" nếu là Card
            }}
          >
            {/* {console.log(viz)} */}
            {/* Nội dung của visualization, bạn có thể tùy chỉnh */}
            {viz.type === "Table" ? (
              <DataGrid
                rows={data.rows}
                columns={data.columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                pagination
              />
            ) : viz.type.split(" ")[1] === "Chart" ? (
              // data === 1? <h1>{data}</h1>:
              <ApexCharts
                options={data.options}
                series={data.series}
                type={
                  viz.type.split(" ")[0].toLowerCase() === "column"
                    ? "bar"
                    : viz.type.split(" ")[0].toLowerCase()
                } // Loại bỏ "Chart" và chuyển thành chữ thường
                width="100%"
                height="100%"
              />
            ) : (
              <h1>{data}</h1>
            )}
            {/* {calculateVisualizationData(viz, orders, productsData)} */}
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default Visualization;
