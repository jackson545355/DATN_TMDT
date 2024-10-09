import { Component } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default class CustomerList extends Component {
  state = {
    customers: [],
    searchResults: [],
    loading: true,
    error: null,
    searchId: "",
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = async () => {
    try {
      // Sử dụng axios để gọi API get
      const response = await axios.get("http://localhost:3000/auth/users");

      if (response.status === 200 && response.data.success) {
        const customers = response.data.users.map((user) => ({
          id: user._id,
          fullName: user.fullName || "N/A", // Nếu không có fullName thì trả về "N/A"
          username: user.username,
          email: user.email,
          address: user.address || "N/A", // Thêm trường hợp không có address
          phone: user.phone || "N/A", // Thêm trường hợp không có phone
          gender: user.gender || "N/A", // Thêm trường hợp không có gender
          birth: user.Birth || "N/A", // Thêm trường hợp không có ngày sinh
          profileImage: user.profileImage || "", // Thêm profileImage nếu có
        }));
        this.setState({ customers, searchResults: customers, loading: false });
      } else {
        throw new Error("Failed to fetch customers");
      }
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  handleSearchChange = (event) => {
    this.setState({ searchId: event.target.value });
  };

  handleSearch = () => {
    const { customers, searchId } = this.state;
    const searchResults = customers.filter((customer) =>
      customer.id.includes(searchId)
    );
    this.setState({ searchResults });
  };

  render() {
    const { searchResults, loading, error, searchId } = this.state;

    const columns = [
      {
        field: "id",
        headerName: "ID",
        width: 200,
        description: "ID of the customer",
      },
      {
        field: "fullName",
        headerName: "Full Name",
        width: 200,
        description: "Customer full name",
      },
      {
        field: "username",
        headerName: "Username",
        width: 200,
        description: "Customer username",
      },
      {
        field: "email",
        headerName: "Email",
        width: 250,
        description: "Customer email",
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 150,
        description: "Customer phone number",
      },
      {
        field: "address",
        headerName: "Address",
        width: 300,
        description: "Customer address",
      },
      {
        field: "gender",
        headerName: "Gender",
        width: 100,
        description: "Customer gender",
      },
      {
        field: "birth",
        headerName: "Birth Date",
        width: 150,
        description: "Customer birth date",
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            label="Search by ID"
            variant="outlined"
            value={searchId}
            onChange={this.handleSearchChange}
            sx={{ marginRight: 2 }}
          />
          <Button variant="contained" color="primary" onClick={this.handleSearch}>
            Search
          </Button>
        </Box>
        <DataGrid
          sx={{
            borderLeft: 0,
            borderRight: 0,
            borderRadius: 0,
          }}
          rows={searchResults}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          rowSelection={false}
        />
      </Box>
    );
  }
}
