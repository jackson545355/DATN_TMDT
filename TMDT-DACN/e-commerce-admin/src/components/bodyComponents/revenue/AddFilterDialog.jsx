import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

class AddFilterDialog extends React.Component {
  state = {
    filterField: "",
    filterValue: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {
    // Handle the submit logic to add the filter
    console.log("Adding filter:", this.state);
    this.props.onClose();
  };

  render() {
    const { open, onClose } = this.props;
    const { filterField, filterValue } = this.state;
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Filter</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Field</InputLabel>
            <Select
              value={filterField}
              onChange={this.handleChange}
              name="filterField"
            >
              {/* Add options like Order ID, Product Name, etc. */}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Filter Value"
            type="text"
            fullWidth
            name="filterValue"
            value={filterValue}
            onChange={this.handleChange}
          />
          <Button onClick={this.handleSubmit}>Add Filter</Button>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default AddFilterDialog;
