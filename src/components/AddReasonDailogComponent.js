import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import Axios from 'axios';
import { BASE_URL } from '../constant';

const AddReasonDailogComponent = ({ open, onClose, isEdit, setReasonValue, reasonValue,onEditReason, onAdd }) => {
  const dialogStyles = {
    backdropFilter: 'blur(0)', // Disable background blur
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust background opacity
  };

  return (
    <Dialog
      // style={{ opacity }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      open={open}
      onClose={onClose}
      BackdropProps={{ style: dialogStyles }}
      onBackdropClick={onClose}
    >
      <DialogTitle>{isEdit ? 'Edit' : 'Add'} Reason</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>Are you sure you want to {title.toLowerCase()} {itemName}?</DialogContentText> */}
        <TextField
          name="reason"
          multiline
          minRows={3}
          value={reasonValue}
          placeholder="Enter Reason"
          onChange={(e) => setReasonValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setReasonValue('');
          }}
          color="error"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            // onAddFeedback();
            onClose();
            if(isEdit) {
              onEditReason()
            } else {
              onAdd()
            }
          }}
          color="primary"
        >
          {isEdit ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReasonDailogComponent;
