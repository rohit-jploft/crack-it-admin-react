import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const DeleteAlert = ({ open, onClose, onConfirmDelete, itemName, title }) => {
  const dialogStyles = {
    backdropFilter: 'blur(0)', // Disable background blur
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust background opacity
  };
  return (
    <Dialog style={{opacity:"0.5"}} aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description" open={open} onClose={onClose} BackdropProps={{ style: dialogStyles }} onBackdropClick={onClose} >
      <DialogTitle>{title} Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to {title.toLowerCase()} {itemName}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirmDelete();
            onClose();
          }}
          color="error"
        >
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAlert;
