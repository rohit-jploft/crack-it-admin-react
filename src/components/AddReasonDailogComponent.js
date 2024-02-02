import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import Axios from 'axios';
import { BASE_URL } from '../constant';

const AddReasonDailogComponent = ({
  open,
  onClose,
  isEdit,
  setReasonValue,
  reasonValue,
  onEditReason,
  onAdd,
  reasonRole,
  setReasonRole,
}) => {
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
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <DialogContentText>Are you sure you want to {title.toLowerCase()} {itemName}?</DialogContentText> */}
        <TextField
          name="reason"
          multiline
          style={{ margin: '10px' }}
          minRows={3}
          value={reasonValue}
          placeholder="Enter Reason"
          onChange={(e) => setReasonValue(e.target.value)}
        />
        <TextField
          name="role"
          select
          placeholder="select role"
          style={{ margin: '10px' }}
          value={reasonRole}
          onChange={(e) => setReasonRole(e.target.value)}
        >
          {[
            { label: 'User', value: 'USER' },
            { label: 'Expert', value: 'EXPERT' },
          ].map((option) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            );
          })}
        </TextField>
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
            if (isEdit) {
              onEditReason();
            } else {
              onAdd();
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
