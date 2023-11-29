import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAgencyProfile, getExpertProfile } from '../data/user';

const ShowAgencyProfileDailog = ({ open, setOpen, userId }) => {
  const [data, setData] = useState();

  const getProfileData = async () => {
    if (userId) {
      const res = await getAgencyProfile(userId);
      console.log(res, 'Agency datatata');
      setData(res?.data?.expert);
    }
  };
  console.log(userId);

  useEffect(() => {
    getProfileData();
  }, [userId, open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Agency Profile</DialogTitle>
      <DialogContent>
        <Typography sx={{ margin: '5px' }}>
          <b>Name :</b> {data?.agency?.agencyName} 
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Email : </b>
          {data?.agency.email}{' '}
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
          <b>Expertise : {'    '}</b>
          {data?.expertise?.map((item) => {
            return <Chip label={item?.title} variant="outlined" />;
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowAgencyProfileDailog;
