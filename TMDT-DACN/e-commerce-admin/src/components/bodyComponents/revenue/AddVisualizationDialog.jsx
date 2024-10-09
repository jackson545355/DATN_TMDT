import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Slider,
  Typography,
  Autocomplete,
  Button,
  DialogActions,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const options = [
  "Card",
  "Bar Chart",
  "Line Chart",
  "Pie Chart",
  "Column Chart",
  "Table",
];
const chartRules = {
  "Dashboard": {},
  "Line Chart": {
    categories: [
      "Ngày đặt hàng",
      "Ngày gửi hàng",
      "Thời gian đơn hàng được hoàn thành",
    ],
    values: ["Số lượng", "Giá gốc", "Tổng giá bán (sản phẩm)"],
    functions: ["Sum", "Average", "Count"],
  },
  "Bar Chart": {
    categories: ["Tên sản phẩm", "Tên phân loại hàng"],
    values: ["Số lượng", "Tổng giá bán (sản phẩm)"],
    functions: ["Sum", "Count"],
  },
  "Pie Chart": {
    categories: ["Tên phân loại hàng"],
    values: ["Số lượng"],
    functions: ["Count"],
  },
  "Column Chart": {
    categories: ["Tên sản phẩm", "Ngày đặt hàng"],
    values: ["Tổng giá bán (sản phẩm)", "Số lượng"],
    functions: ["Sum", "Average"],
  },
  Table: {
    categories: ["Tên sản phẩm"],
    values: ["Số lượng", "Giá gốc", "Tổng giá bán (sản phẩm)"],
    functions: ["Sum", "Count", "Average"],
  },
  Card: {
    categories: ["Tên sản phẩm"],
    values: ["Tổng giá bán (sản phẩm)", "Số lượng"],
    functions: ["Sum", "Count"],
  },
};

// const functionOptions = ["Sum", "Average", "Count", "Count (Distinct)"];

function AddVisualizationDialog({ open, onClose, onAddVisualization }) {
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState(1);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [valueField, setValueField] = useState("");
  const [functionType, setFunctionType] = useState("");
  const [functionOptions, setFunctionOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [valueOptions, setValueOptions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (type) {
      const { categories = [], values = [], functions = [] } = chartRules[type] || {};
      setCategoryOptions(categories);
      setValueOptions([]);
      setFunctionOptions([]);
      setCategory("");
      setValueField("");
      setFunctionType("");
    }
  }, [type]);

  // Cập nhật các tùy chọn value và function khi thay đổi category
  useEffect(() => {
    if (category && type) {
      const { values = [], functions = [] } = chartRules[type] || {};
      setValueOptions(values);
      setFunctionOptions(functions);
    }
  }, [category, type]);
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Visualization</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Autocomplete
          options={Object.keys(chartRules)}
          value={type}
          onChange={(event, newValue) => setType(newValue || "")}
          isOptionEqualToValue={(option, value) =>
            option === value || value === ""
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Visualization Type"
              variant="outlined"
              margin="dense"
            />
          )}
        />
        {type !== "Dashboard" && (
          <>
            <Typography>Width</Typography>
            <Slider
              value={width}
              step={1}
              marks
              min={1}
              max={4}
              onChange={(event, newValue) => setWidth(newValue)}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
            <Autocomplete
              options={categoryOptions}
              value={category}
              onChange={(event, newValue) => setCategory(newValue || "")}
              isOptionEqualToValue={(option, value) =>
                option === value || value === ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category Field"
                  variant="outlined"
                  margin="dense"
                />
              )}
            />

            <Autocomplete
              options={valueOptions}
              value={valueField}
              onChange={(event, newValue) => setValueField(newValue || "")}
              isOptionEqualToValue={(option, value) =>
                option === value || value === ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Value Field"
                  variant="outlined"
                  margin="dense"
                />
              )}
            />

            <Autocomplete
              options={functionOptions}
              value={functionType}
              onChange={(event, newValue) => setFunctionType(newValue || "")}
              isOptionEqualToValue={(option, value) =>
                option === value || value === ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Function"
                  variant="outlined"
                  margin="dense"
                />
              )}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={() => {
            if (!title || !type) {
              handleOpenSnackbar(
                "Please fill the title and type before adding the visualization."
              );
              return;
            }
          
            if (type === "Dashboard") {
              // Nếu là Dashboard thì chỉ cần title và type
              const visualizationData = {
                title,
                type,
              };
              console.log("visual (Dashboard)", visualizationData);
              onAddVisualization(visualizationData);
              onClose();
            } else {
              // Nếu không phải Dashboard thì cần điền đầy đủ các trường khác
              if (!category || !valueField || !functionType) {
                handleOpenSnackbar(
                  "Please fill all fields before adding the visualization."
                );
                return;
              }
          
              const visualizationData = {
                title,
                type,
                category,
                valueField,
                functionType,
                width,
              };
              console.log("visual", visualizationData);
              onAddVisualization(visualizationData);
              onClose();
            }
          }}
          
        >
          Add
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Dialog>
  );
}

export default AddVisualizationDialog;
