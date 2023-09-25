import React, { useState } from 'react';
import { Container, TextField, Button, Typography, InputAdornment, IconButton, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
import * as Yup from 'yup';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import {changePasswordApi} from "../data/user"


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  form: {
    maxWidth: '400px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
    width:'100%'
  },
  button: {
    marginTop: theme.spacing(2),
  },
  iconButton: {
    padding: 0,
  },
}));

const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  newPassword: Yup.string()
    .required('New Password is required')
    .min(6, 'New Password must be at least 6 characters')

    .notOneOf([Yup.ref('oldPassword')], 'New Password must be different from Old Password')
    .matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Password must contain at least 8 characters, one uppercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')

    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Password must contain at least 8 characters, one uppercase letter, one number, and one special character'
    ),
});

const ChangePassword = () => {
  const classes = useStyles();
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = () => {
    // Check if the new password and confirm password match
    if (newPassword === confirmPassword) {
      // Perform your password change logic here
      console.log('Password changed successfully');
    } else {
      console.error('New password and confirm password do not match');
    }
  };
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit:async (values) => {
      console.log(values);
      const res = await changePasswordApi(values)
      console.log(res)
      if(res && res.success && res.status === 200 && res.type === 'success'){
        toast.success(res.message, {onClose:() => {
            navigate("/dashboard/app")
        }, autoClose:400})
      }
      if(res && !res.success && res.status === 406 && res.type === 'error'){
        toast.error(res.message)
      }
    },
  });

  return (
    <Container className={classes.root}>
        <ToastContainer/>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Change Password
      </Typography>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
            <TextField
              type={showOldPassword ? 'text' : 'password'}
              label="Old Password"
              name="oldPassword"
              className={classes.textField}
              {...formik.getFieldProps('oldPassword')}
              onChange={formik.handleChange}
              value={formik.values.oldPassword}
              error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
              helperText={formik.touched.oldPassword && formik.errors.oldPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton className={classes.iconButton} onClick={handleToggleOldPasswordVisibility}>
                      {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              name="newPassword"
              className={classes.textField}
              {...formik.getFieldProps('newPassword')}
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton className={classes.iconButton} onClick={handleToggleNewPasswordVisibility}>
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              name="confirmPassword"
              className={classes.textField}
              {...formik.getFieldProps('confirmPassword')}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton className={classes.iconButton} onClick={handleToggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              className={classes.button}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ChangePassword;
