import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getExpertProfile } from '../data/user';
import { getSingleBookingDetail } from '../data/meetings';
import { autoCapitaliseFirstLetter, getDateFromTimeStamps } from '../utils/helper';

const ShowMeetingDetailDailog = ({ open, setOpen, meetingId, expertName, userName }) => {
  const [data, setData] = useState();

  const getProfileData = async () => {
    if (meetingId) {
      console.log(meetingId, "meetingId")
      const res = await getSingleBookingDetail(meetingId);
      console.log(res.data, 'meeting single');
      setData(res?.data);
    }
  };
  console.log(meetingId);

  useEffect(() => {
    getProfileData();
  }, [meetingId, open]);

  return (
    <Dialog  aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description" open={open} onClose={() => setOpen(false)} fullWidth >
      <DialogTitle>Meeting Details</DialogTitle>
      <DialogContent>
        <Typography sx={{ margin: '5px', marginRight:"15px" }}>
          <b>Expert Name :</b> {autoCapitaliseFirstLetter( expertName || data?.booking?.booking?.expert.firstName)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>User Name : </b>
          {autoCapitaliseFirstLetter(userName)}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Job Category :</b> {autoCapitaliseFirstLetter(data?.booking?.booking?.jobCategory?.title)}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Date :</b> {getDateFromTimeStamps(data?.booking?.booking?.date)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Meeting status :</b> {data?.booking?.booking?.status}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Cancel Reason :</b> {data?.cancel?.reason?.reason ? data?.cancel?.reason?.reason : "No value"}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Comment</b> {data?.cancel?.comment ? data?.cancel?.comment : "No value"}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>TimeZone :</b> {autoCapitaliseFirstLetter(data?.booking?.booking?.timeZone)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>StartTime :</b> {getDateFromTimeStamps(data?.booking.booking.startTime)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>EndTime :</b> {getDateFromTimeStamps(data?.booking?.booking?.endTime)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Payment Status :</b> {data?.booking?.status}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>GrandTotal :</b> ${data?.booking?.grandTotal}{' '}
        </Typography>

        <Typography sx={{ margin: '5px' }}>
          <b>Job description : </b>
          {autoCapitaliseFirstLetter(data?.booking.booking.jobDescription)}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Skills : {'    '}</b>
          {data?.booking?.booking?.skills?.map((item) => {
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

export default ShowMeetingDetailDailog;
