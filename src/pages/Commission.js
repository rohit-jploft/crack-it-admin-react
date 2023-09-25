import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet-async';
import { toast, ToastContainer } from 'react-toastify';

import { getCommission, updateAmount } from '../data/commission';

const useStyles = makeStyles((theme) => ({
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

function Commission({open, setOpen}) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [data, setData] = useState();
  const [updatedAmount, setUpdatedAmount] = useState(data);

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCommissionData = async () => {
    const data = await getCommission();
    console.log(data);
    setData(data[0]);
  };

  useEffect(() => {
    getCommissionData();
  }, [isDone]);

  const handleSaveClick = async () => {
    setIsDone(true);
    // Save the updated data to your backend or perform other actions here
    const res = await updateAmount(data?._id, updatedAmount);
    if (res.status === 200) {
      toast('Amount updated successfully', { type: 'success' });
    } else {
      toast('Something went wrong', { type: 'error' });
    }
    setIsDone(false);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setUpdatedAmount(e.target.value);
  };

  return (
    <div>
      <Helmet>
        <title>Commission</title>
      </Helmet>
      <ToastContainer />
      {/* <Button variant="contained" onClick={handleEditClick}>
        Edit Commission
      </Button> */}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set Commission Amount</DialogTitle>
        <DialogContent>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="div">
              Commission
            </Typography>
            <Stack>
              <Typography variant="h6" color="text.secondary">
                <b>Name</b>: {data?.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                <b>Type</b>: {data?.type}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                <b>Amount</b>: ${data?.amount}
              </Typography>
            </Stack>
            <TextField
              label="Amount"
              variant="outlined"
              placeholder="Update amount"
              fullWidth
              type="number"
              value={updatedAmount}
              onChange={handleInputChange}
            />
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveClick}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Commission;
