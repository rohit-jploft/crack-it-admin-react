import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getExpertProfile } from '../data/user';


const ShowExpertProfileDialog = ({ open, setOpen, userId }) => {
  const [data, setData] = useState();

  const getProfileData = async () => {
    if (userId) {
      const res = await getExpertProfile(userId);
      console.log(res, 'expert datatata');
      setData(res?.data?.expert);
    }
  };
  console.log(userId);

  useEffect(() => {
    getProfileData();
  }, [userId, open]);

  return (
    <Dialog style={{opacity:"0.5"}} aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description" open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Expert Profile</DialogTitle>
      <DialogContent>
        <Typography sx={{ margin: '5px' }}>
          <b>Name :</b> {data?.user?.firstName} {data?.user?.firstName}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Email : </b>
          {data?.user?.email}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Job Category :</b> {data?.jobCategory?.title}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Experience :</b> {data?.experience}{' '} Years
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Price :</b> ${data?.price}{' '}
        </Typography>
        {/* <Typography sx={{ margin: '5px' }}>
          <b>Job Category :</b> {data?.jobCategory?.title}{' '}
        </Typography> */}
        <Typography sx={{ margin: '5px' }}>
          <b>Job description : </b>
          {data?.description}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Expertise : {"    "}</b>
          {data?.expertise?.map((item) => {
            return <Chip label={item?.title} variant="outlined" />;
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowExpertProfileDialog;
