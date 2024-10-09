import { Avatar, Box, Button, Modal, Typography, TextField, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { Component } from "react";
import { format, isSameDay } from "date-fns";
import OrderModal from "./OrderModal";
import axios from 'axios';
import RefreshIcon from "@mui/icons-material/Refresh";
export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      filteredOrders: [],
      order: {},
      open: false,
      loading: true,
      error: null,
      searchId: "",
      filterStatus: "",
      filterDateValue: new Date(),
      dateDialogOpen: false,
      dateFilteredOrders: [],
      statusFilteredOrders: [],
    };
  }

  
  componentDidMount() {
    this.fetchOrders();
    console.log("aaaaaaaaaa")
  }

  // Chỉ fetch thông tin chi tiết khi người dùng nhấn vào nút Order Details
  fetchOrderData = async (order) => {
    try {
      const productPromises = order.products.map(async (product) => {
        const productResponse = await axios.get(`http://localhost:3002/products/get-one-by-id/${product.product}`);
        return {
          ...product,
          productName: productResponse.data.product.name_product,
        };
      });
      const Fullname = await axios.get(`http://localhost:3001/auth/user/${order.user}/fullname`)
      console.log(Fullname.data.fullName)
      const products = await Promise.all(productPromises);
      console.log(order)
      return {
        id: order.id,
        user: Fullname.data.fullName,
        products: products,
        status: order.status,
        total: order.total,
        phone: order.phone,
        address: order.address,
        createdAt: new Date(order.createdAt),
        // shippingTime: order.updateTime.shipping,
        // completedTime: order.updateTime.completed,
        // canceledTime: order.updateTime.canceled,
      };
    } catch (error) {
      console.error("Failed to fetch order data:", error);
      return null; // Xử lý lỗi riêng cho từng yêu cầu
    }
  };

  fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3003/orders/all");
      if (response.data.success) {
        const orders = response.data.orders.map(order => ({
          id: order._id,
          user: order.user,
          total: order.total,
          status: order.status,
          shippingTime: order.updateTime?.shipping || null,  // Map shippingTime từ updateTime
          completedTime: order.updateTime?.completed || null,  // Map completedTime từ updateTime
          canceledTime: order.updateTime?.cancelled || null,  // Map canceledTime từ updateTime
          createdAt: order.createdAt,
          products: order.products,
          phone: order.Phone,
          address: order.address,
        }));
  
        this.setState({
          orders: orders,
          filteredOrders: orders,
          dateFilteredOrders: orders,
          statusFilteredOrders: orders,
          loading: false,
        });
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };
  

  handleOrderDetail = async (order) => {
    const orderData = await this.fetchOrderData(order);
    if (orderData) {
      this.setState({ order: orderData, open: true });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSearchChange = (event) => {
    this.setState({ searchId: event.target.value }, this.applyFilters);
  };

  handleFilterChange = (event) => {
    this.setState({ filterStatus: event.target.value }, this.applyStatusFilter);
  };

  handleDateChange = (event) => {
    this.setState({ filterDateValue: new Date(event.target.value) }, this.applyDateFilter);
  };

  handleOpenDateDialog = () => {
    this.setState({ dateDialogOpen: true });
  };

  handleCloseDateDialog = () => {
    this.setState({ dateDialogOpen: false });
  };

  handleApplyDateFilter = () => {
    this.setState({ dateDialogOpen: false }, this.applyDateFilter);
  };

  applyDateFilter = () => {
    const { orders, filterDateValue } = this.state;
    const dateFilteredOrders = orders.filter(order => isSameDay(new Date(order.createdAt), filterDateValue));
    this.setState({ dateFilteredOrders }, this.combineFilters);
  };

  applyStatusFilter = () => {
    const { orders, filterStatus } = this.state;
    const statusFilteredOrders = filterStatus ? orders.filter(order => order.status === filterStatus) : orders;
    this.setState({ statusFilteredOrders }, this.combineFilters);
  };

  combineFilters = () => {
    const { dateFilteredOrders, statusFilteredOrders } = this.state;
    const filteredOrders = dateFilteredOrders.filter(order => statusFilteredOrders.includes(order));
    this.setState({ filteredOrders });
  };

  applyFilters = () => {
    const { orders, searchId, filterStatus } = this.state;
  
    let filteredOrders = [...orders];
  
    // Lọc theo ID nếu người dùng nhập vào
    if (searchId) {
      filteredOrders = filteredOrders.filter(order => order.id.includes(searchId));
    }
  
    // Lọc theo trạng thái đơn hàng
    if (filterStatus) {
      filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
    }
  
    this.setState({ filteredOrders });
  };
  

  render() {
    const { filteredOrders, loading, error, searchId, filterStatus, filterDateValue, dateDialogOpen } = this.state;

    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 200,
        description: "ID of the order",
      },
      {
        field: "total",
        headerName: "Total Amount",
        width: 150,
        description: "Total amount of the order",
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        description: "Status of the order",
      },
      {
        field: "createdAt",  // Thêm cột Created At
        headerName: "Created At",
        width: 200,
        description: "Order Creation Date",
        valueGetter: (params) => format(new Date(params.row.createdAt), "dd-MM-yyyy HH:mm"),  // Định dạng ngày
      },
      {
        field: "shippingTime",
        headerName: "Shipping Time",
        width: 200,
        description: "Time when the order was shipped",
        valueGetter: (params) => params.row.shippingTime ? format(new Date(params.row.shippingTime), "dd-MM-yyyy HH:mm") : "N/A",
      },
      {
        field: "completedTime",
        headerName: "Completed Time",
        width: 200,
        description: "Time when the order was completed",
        valueGetter: (params) => params.row.completedTime ? format(new Date(params.row.completedTime), "dd-MM-yyyy HH:mm") : "N/A",
      },
      {
        field: "canceledTime",
        headerName: "Canceled Time",
        width: 200,
        description: "Time when the order was canceled",
        valueGetter: (params) => params.row.canceledTime ? format(new Date(params.row.canceledTime), "dd-MM-yyyy HH:mm") : "N/A",
      },
      {
        field: "details",
        headerName: "Order Details",
        width: 150,
        description: "Details of the order",
        renderCell: (params) => {
          const order = params.row;
          return (
            <Button
              variant="contained"
              sx={{ bgcolor: "#504099" }}
              onClick={() => this.handleOrderDetail(order)}
            >
              Order Details
            </Button>
          );
        },
      },
    ];
    

    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (error) {
      return <Typography>Error: {error}</Typography>;
    }

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <TextField
            label="Search by ID"
            variant="outlined"
            value={searchId}
            onChange={this.handleSearchChange}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            color="primary"
            aria-label="refresh products"
            onClick={this.fetchOrders}
          >
            <RefreshIcon />
          </IconButton>
            <TextField
              label="Filter by Status"
              variant="outlined"
              select
              value={filterStatus}
              onChange={this.handleFilterChange}
              sx={{ width: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="shipping">Shipping</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
            <Button
              variant="contained"
              sx={{ bgcolor: "#504099" }}
              onClick={this.handleOpenDateDialog}
            >
              Select Date
            </Button>
          </Box>
        </Box>
        {filteredOrders.length === 0 ? (
          <Typography>No orders found for the selected filters.</Typography>
        ) : (
          <DataGrid
            sx={{
              borderLeft: 0,
              borderRight: 0,
              borderRadius: 0,
            }}
            rows={filteredOrders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 30]}
            rowSelection={false}
          />
        )}
        <Modal open={this.state.open} onClose={this.handleClose}>
          <Box>
            <OrderModal order={this.state.order} onUpdateOrderStatus={this.handleUpdateOrderStatus} />
          </Box>
        </Modal>
        <Dialog open={dateDialogOpen} onClose={this.handleCloseDateDialog}>
          <DialogTitle>Select Date</DialogTitle>
          <DialogContent>
            <TextField
              variant="outlined"
              type="date"
              value={format(filterDateValue, "yyyy-MM-dd")}
              onChange={this.handleDateChange}
              sx={{ width: '100%' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDateDialog}>Cancel</Button>
            <Button onClick={this.handleApplyDateFilter}>Apply</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}
