import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getExpertProfile } from '../data/user';
import { getSingleBookingDetail } from '../data/meetings';
import { getDateFromTimeStamps } from '../utils/helper';


const ShowMeetingDetailDailog = ({ open, setOpen, meetingId,expertName, userName }) => {
  const [data, setData] = useState();

  const getProfileData = async () => {
    if (meetingId) {
      const res = await getSingleBookingDetail(meetingId);
      console.log(res.data, "meeting single")
      setData(res?.data);
    }
  };
  console.log(meetingId);

  useEffect(() => {
    getProfileData();
  }, [meetingId, open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Meeting Details</DialogTitle>
      <DialogContent>
        <Typography sx={{ margin: '5px' }}>
          <b>Expert Name :</b> {expertName}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>User Name : </b>
          {userName}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>Job Category :</b> {data?.booking?.booking?.jobCategory?.title}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>date :</b> {getDateFromTimeStamps(data?.booking?.booking?.date)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>meeting status :</b> {data?.booking?.booking?.status}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>TimeZone :</b> {data?.booking?.booking?.timeZone}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>StartTime :</b> {getDateFromTimeStamps(data?.booking.booking.startTime)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>endTime :</b> {getDateFromTimeStamps(data?.booking?.booking?.endTime)}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>payment Status :</b> {data?.booking?.status}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>grandTotal :</b> ${data?.booking?.grandTotal}{' '}
        </Typography>
       
        <Typography sx={{ margin: '5px' }}>
          <b>Job description : </b>
          {data?.booking.booking.jobDescription}{' '}
        </Typography>
        <Typography sx={{ margin: '5px' }}>
          <b>skills : {"    "}</b>
          {data?.booking?.booking?.skills?.map((item) => {
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

export default ShowMeetingDetailDailog;
