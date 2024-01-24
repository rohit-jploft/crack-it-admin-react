import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import Axios from 'axios';
import { BASE_URL } from '../constant';

const AddFeedbackComponent = ({ open, onClose, ticketId, opacity, isFeedbackAdded }) => {
  const dialogStyles = {
    backdropFilter: 'blur(0)', // Disable background blur
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust background opacity
  };
  const [feedback, setFeedback] = useState('');

  const onAddFeedback = async () => {
    const feedbackAdd = await Axios.put(`${BASE_URL}ticket/feedback/add/${ticketId}`, { feedback });
    console.log(feedbackAdd, "feedbackAdd")
    onClose()
    isFeedbackAdded(true)
  };
  return (
    <Dialog
      style={{ opacity }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      open={open}
      onClose={onClose}
      BackdropProps={{ style: dialogStyles }}
      onBackdropClick={onClose}
    >
      <DialogTitle>Add Feedback</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>Are you sure you want to {title.toLowerCase()} {itemName}?</DialogContentText> */}
        <TextField
          name="feedback"
          multiline
          minRows={3}
          placeholder="Enter admin's feedback"
          onChange={(e) => setFeedback(e.target.value)}
          value={feedback}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onAddFeedback();
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFeedbackComponent;
