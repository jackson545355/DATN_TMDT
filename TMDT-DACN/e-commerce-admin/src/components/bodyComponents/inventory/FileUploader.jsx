import React, { useRef, useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";

const FileUploader = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success'); // success, error
  const [alertMessage, setAlertMessage] = useState('');
  const inputRef = useRef(null);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log(event);
    const file = event.target.files[0];
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:3002/products/create-by-file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      if (response.data.success) {
        setAlertSeverity('success');
        setAlertMessage('File uploaded successfully!');
      } else {
        setAlertSeverity('warning');
        setAlertMessage('File uploaded, but some issues were found.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setAlertSeverity('error');
      setAlertMessage('Error uploading file.');
    }
    setOpenSnackbar(true);
    inputRef.current.value = "";
  };
    
  return (
    <div>
      <input
        accept=".xlsx, .xls, .csv"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        // multiple
        ref={inputRef} // Gán ref cho input file
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          Upload Files
        </Button>
      </label>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
    
  );
};

export default FileUploader;
