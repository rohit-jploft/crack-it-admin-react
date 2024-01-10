import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PasswordIcon from '@mui/icons-material/Password';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import Axios from 'axios';
import { BASE_URL } from '../../../constant';
import account from '../../../data/account';
import { isAdmin } from '../../../data/user';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [];

// ----------------------------------------------------------------------

export default function AccountPopover({setCommissionModel, showCommissionModel}) {
  const [open, setOpen] = useState(null);
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const issdmin = isAdmin()

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const getUserData = async () => {
    const token = localStorage.getItem('token');
    const res = await Axios.get(`${BASE_URL}auth/user/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.data) {
      setUserData(res.data.data);
    }
  };
  useEffect(() => {
    getUserData();
  }, [showCommissionModel,open]);
  console.log(issdmin , "isAdmin")

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userData?.firstName} {userData?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData?.email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
           <b> {userData?.role}</b>
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

       {!issdmin && <MenuItem
          onClick={() => {
            handleClose();
            setCommissionModel(true)
          
          }}
          sx={{ m: 1 }}
        >
          Set Commission
        </MenuItem>}
       
        <MenuItem
          onClick={() => {
            handleClose();
            navigate('/dashboard/change-password');
          
          }}
          sx={{ m: 1 }}
        >
          Change Password
        </MenuItem>
        <MenuItem
          onClick={() => {
            localStorage.removeItem('token');
            handleClose();
            navigate('/dashboard/app');
            // window.location.reload();
          }}
          sx={{ m: 1 }}
        >
          <LogoutIcon />
          {" "}Logout
        </MenuItem>
      </Popover>
    </>
  );
}
