import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  Autocomplete,
  createFilterOptions,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FileUploader from "./FileUploader";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colorStockPairs, setColorStockPairs] = useState([
    { color: "", stock: 0 },
  ]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Sản phẩm khớp với từ khóa
  const [searchTerm, setSearchTerm] = useState("");

  const categoryMap = {
    0: "Điện tử",
    1: "Gia dụng",
    2: "Mỹ phẩm",
  };
  const categories = [
    { id: 0, label: "Điện tử" },
    { id: 1, label: "Gia dụng" },
    { id: 2, label: "Mỹ phẩm" },
  ];
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.label || option,
  });

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 90,
      description: "id of the product",
    },
    {
      field: "name_product",
      headerName: "Product",
      width: 400,
      description: "",
      renderCell: (cellData) => {
        return <Product productName={cellData.row.name_product} />;
      },
    },
    {
      field: "id_category",
      headerName: "Category",
      width: 120,
      description: "category of the product",
      valueGetter: (params) => categoryMap[params.row.id_category] || "Unknown",
    },
    {
      field: "price_product",
      headerName: "Price",
      width: 120,
      description: "price of the product",
      valueGetter: (params) => "$" + params.row.price_product,
    },
    {
      field: "totalStock",
      headerName: "totalStock",
      width: 100,
      description: "how many items in the stock",
      valueGetter: (params) => params.row.totalStock + " pcs",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3002/products/getAll");
      const data = await response.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
      // Extract unique brands from fetched products
      const uniqueBrands = [
        ...new Set(data.products.map((product) => product.brand)),
      ];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    // Cập nhật thông tin màu sắc và tồn kho cho form chỉnh sửa
    const productColors = product.colors.map((color) => ({
      color: color.color,
      stock: color.stock,
    }));
    setColorStockPairs(productColors); // Giả sử bạn đã quản lý state này

    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3002/products/delete-one-by-id/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Delete successful",
          severity: "success",
        });
        fetchProducts();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleAdd = () => {
    setCurrentProduct({
      name_product: "",
      price_product: "",
      description: "",
      number: 0,
      id_category: 0,
      brand: "",
    });
    setColorStockPairs([{ color: "", stock: 0 }]);
    setIsEdit(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
    setSelectedFiles([]);
  };

  const handleSave = async () => {
    if (
      !currentProduct.name_product ||
      !currentProduct.price_product ||
      !currentProduct.description ||
      currentProduct.number === 0 ||
      // currentProduct.id_category === 0 ||
      !currentProduct.brand
    ) {
      console.log(currentProduct);
      setSnackbar({
        open: true,
        message: "Please fill out all required fields",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name_product", currentProduct.name_product);
    formData.append("price_product", currentProduct.price_product);
    formData.append("description", currentProduct.description);
    formData.append("number", currentProduct.number);
    // formData.append("stock", currentProduct.stock);
    formData.append("id_category", currentProduct.id_category);
    formData.append("brand", currentProduct.brand);
    formData.append("model3D", currentProduct.model3D);
    formData.append("colors", JSON.stringify(colorStockPairs));
    console.log(colorStockPairs);
    if (!isEdit) {
      selectedFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });
    }
    // console.log("current",JSON.stringify(currentProduct));
    // console.log(isEdit ? "PUT" : "POST");
    // console.log(isEdit ? JSON.stringify(currentProduct) : formData);
    // console.log(isEdit ? { "Content-Type": "application/json" } : undefined);
    console.table(currentProduct);
    console.log(currentProduct);
    try {
      const response = await fetch(
        `http://localhost:3002/products/${
          isEdit ? `update-one-by-id/${currentProduct._id}` : "create-one/"
        }`,
        {
          method: isEdit ? "PUT" : "POST",
          body: isEdit ? JSON.stringify(currentProduct) : formData,
          headers: isEdit ? { "Content-Type": "application/json" } : undefined,
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `${isEdit ? "Edit" : "Add"} successful`,
          severity: "success",
        });
        fetchProducts();
        handleClose();
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to ${isEdit ? "edit" : "add"} product`
        );
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
    console.log(e);
  };
  const handleColorStockChange = (index, field, value) => {
    if (isEdit) {
      const updatedProductColors = currentProduct.colors.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );

      // Cập nhật currentProduct với màu sắc mới
      setCurrentProduct({
        ...currentProduct,
        colors: updatedProductColors,
      });
      console.log(currentProduct);
    }
    const updatedPairs = [...colorStockPairs];
    updatedPairs[index][field] = value;
    setColorStockPairs(updatedPairs);
    console.log(colorStockPairs);
  };

  const addColorStockPair = () => {
    const newPairs = [...colorStockPairs, { color: "", stock: 0 }];
    setColorStockPairs(newPairs);

    if (isEdit) {
      const newColors = [...currentProduct.colors, { color: "", stock: 0 }];
      setCurrentProduct({
        ...currentProduct,
        colors: newColors,
      });
    }
  };
  const handleDescriptionChange = (value) => {
    setCurrentProduct({ ...currentProduct, description: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddFieldToAllProducts = async () => {
    if (!fieldToAdd || !valueToAdd) {
      setSnackbar({
        open: true,
        message: "Please enter both field name and value.",
        severity: "warning",
      });
      return;
    }

    const updatedProducts = products.map((product) => ({
      ...product,
      [fieldToAdd]: valueToAdd,
    }));

    try {
      const response = await fetch(
        "http://localhost:3002/products/update-many",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProducts),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "All products updated successfully!",
          severity: "success",
        });
        fetchProducts(); // Reload products to reflect changes
      } else {
        throw new Error("Failed to update products");
      }
    } catch (error) {
      console.error("Error updating products:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };
  const removeColorStockPair = (index) => {
    const filteredPairs = colorStockPairs.filter((_, i) => i !== index);
    setColorStockPairs(filteredPairs);

    if (isEdit) {
      const filteredColors = currentProduct.colors.filter(
        (_, i) => i !== index
      );
      setCurrentProduct({
        ...currentProduct,
        colors: filteredColors,
      });
    }
  };
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    console.log(value);
    setSearchTerm(value);

    // Lọc các sản phẩm khớp chính xác
    const filtered = products.filter((product) =>
      product.name_product.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
    console.log(filteredProducts);

    // Lọc các sản phẩm gợi ý (không khớp hoàn toàn nhưng có thể liên quan)
    // const suggested = products.filter(
    //   (product) =>
    //     !product.name_product.toLowerCase().includes(value) &&
    //     product.name_product.toLowerCase().startsWith(value)
    // );
    // setSuggestedProducts(suggested);
  };
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Products</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          {/* Ô tìm kiếm */}
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by product name"
            variant="outlined"
            size="small"
            sx={{ flex: 1 }} // Giúp ô tìm kiếm chiếm không gian còn lại
          />

          {/* Nút refresh */}
          <IconButton
            color="primary"
            aria-label="refresh products"
            onClick={fetchProducts}
            sx={{ border: "1px solid #ccc", borderRadius: "50%" }} // Thêm viền cho nút refresh
          >
            <RefreshIcon />
          </IconButton>

          {/* Nút upload file */}
          <label htmlFor="file-upload">
            <FileUploader></FileUploader>
          </label>

          {/* Nút thêm sản phẩm */}
          <Button
            sx={{ marginLeft: 2 }}
            variant="contained"
            color="primary"
            onClick={handleAdd}
          >
            Add Product
          </Button>
        </Box>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenFieldDialog(true)}
        >
          Add Field to All Products
        </Button> */}
      </Box>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={filteredProducts}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name_product"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            value={currentProduct?.name_product || ""}
            onChange={handleChange}
          />
          <Autocomplete
            value={
              categories.find((c) => c.id === currentProduct?.id_category) ||
              null
            }
            onChange={(event, newValue) => {
              setCurrentProduct({
                ...currentProduct,
                id_category: newValue ? newValue.id : "",
              });
            }}
            options={categories}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                margin="dense"
                variant="standard"
                fullWidth
              />
            )}
            fullWidth
          />
          {colorStockPairs.map((pair, index) => (
            <div key={index}>
              <TextField
                margin="dense"
                name="color"
                label="Color"
                type="text"
                value={pair.color}
                onChange={(e) =>
                  handleColorStockChange(index, "color", e.target.value)
                }
                fullWidth
              />
              <TextField
                margin="dense"
                name="stock"
                label="Stock"
                type="number"
                value={pair.stock}
                onChange={(e) =>
                  handleColorStockChange(index, "stock", Number(e.target.value))
                }
                fullWidth
              />
              {index > 0 && (
                <Button onClick={() => removeColorStockPair(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addColorStockPair}>Add More Color/Stock</Button>

          <TextField
            margin="dense"
            name="price_product"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={currentProduct?.price_product || ""}
            onChange={handleChange}
          />
          {/* {isEdit && (
            <TextField
              margin="dense"
              name="totalStock"
              label="totalStock"
              type="number"
              fullWidth
              variant="standard"
              value={currentProduct?.totalStock || ""}
              onChange={handleChange}
            />
          )} */}
          {/* <TextField
            margin="dense"
            name="number"
            label="Number"
            type="number"
            fullWidth
            variant="standard"
            value={currentProduct?.number || ""}
            onChange={handleChange}
          /> */}

          <Autocomplete
            value={currentProduct?.brand || ""}
            onChange={(event, newValue) => {
              // Kiểm tra xem newValue có phải là một chuỗi (khi người dùng nhập mới)
              // hay một đối tượng (khi chọn từ danh sách)
              const newBrand =
                typeof newValue === "string"
                  ? newValue
                  : newValue?.inputValue || newValue;
              setCurrentProduct({ ...currentProduct, brand: newBrand });
            }}
            filterOptions={filterOptions}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={brands}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brand"
                variant="standard"
                fullWidth
                margin="dense"
              />
            )}
          />

          <TextField
            margin="dense"
            name="model3D"
            label="3D Model URL"
            type="url"
            fullWidth
            variant="standard"
            value={currentProduct?.model3D || ""}
            onChange={handleChange}
          />

          {!isEdit && (
            <input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleImageChange}
              style={{ marginTop: 16 }}
            />
          )}
          <Typography variant="subtitle1" gutterBottom>
            Mô Tả Sản Phẩm
          </Typography>
          <ReactQuill
            theme="snow" // Sử dụng theme 'snow', là theme mặc định với nhiều tính năng
            value={currentProduct?.description || ""}
            onChange={handleDescriptionChange}
            style={{ height: "200px", marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
