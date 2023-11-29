import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import * as Yup from 'yup'; // Import Yup for validation
import { makeStyles } from '@mui/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ErrorMessage, useFormik } from 'formik';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUser } from '../data/user';
import Iconify from '../components/iconify/Iconify';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string()
    // .matches(
    //   /^[0-9]{10}$/, // You can adjust the regular expression to match your desired format
    //   'Phone number must be exactly 10 digits'
    // )
    .required('Phone number is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Password must contain at least 8 characters, one uppercase letter, one number, and one special character'
    ),
});
export default function SignUp(props) {
  const classes = useStyles();
  const [created, setCreated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dailCode, setDialCode] = useState();
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setCreated(true);
      // alert(JSON.stringify(values, null, 2));
      const res = await createUser(values, dailCode, props.isAdmin);
      console.log(res, 'response signup');
      if(res.response && res.response.data){
        toast.error(res.response.data.message, {
         
          autoClose: 800,
        });
      }
      if (res?.data && res.data?.userId) {
        toast.success(res.message, {
          onClose: () => {
            setCreated(false);
            props.close(false);
          },
          autoClose: 800,
        });
        // props.close(false);
      }
      if (res?.type === 'error' && res?.status === 200) toast(res.message, { type: 'error' });
      setCreated(false);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Add New {props.title}
        </Typography>
        <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                id="firstName"
                {...formik.getFieldProps('firstName')}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                id="lastName"
                {...formik.getFieldProps('lastName')}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                id="email"
                fullWidth
                {...formik.getFieldProps('email')}
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="hellos">
              <PhoneInput
                    name="phone"
                    label="Phone Number *"
                    autoCorrect="off"
                    placeholder="Enter a Valid Phone Number"
                    country={"in"}
                    style={{outerWidth:"100%"}}
                    value={`+${dailCode}`}
                    // value={formik.values.phone}
                    onChange={(phone, e) => {
                      console.log('phone', phone);
                      console.log('e', e);
                      setDialCode(e.dialCode);
                      formik.setFieldValue("phone", phone);
                      // setMobileNumberCountryCode(phone)
  
                      // setFieldValue("mobilenumberCountryCode", phone);
                    }}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                {/* <PhoneInput
                  country={'in'}
                  // className="country-selector"
                  
                  enableSearch
                  name="phone"
                  inputProps={{
                    name: 'phone',
                  }}
                  value={`+${dailCode}`}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(phone, e) => {
                    console.log('phone', phone);
                    console.log('e', e);
                    setDialCode(e.dialCode);
                    // if (e.target.value.toString().length <= 10) {
                      formik.setFieldValue("phone", phone)
                    // }
                    // setMobileNumberCountryCode(phone)

                    // setFieldValue("mobilenumberCountryCode", phone);
                  }}
                /> */}

                {/* <div className="phone-number-fils">
                  <TextField
                    name="phone"
                    id="phone"
                    type="number"
                  
                   
                    fullWidth
                    {...formik.getFieldProps('phone')}
                    onChange={(e)=>{
                      if (e.target.value.toString().length <= 10) {
                        formik.handleChange(e)
                      }
                      
                    }}
                    value={formik.values.phone}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </div> */}
              </div>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                select
                name="role"
                label="Role"
                id="role"
                fullWidth
                {...formik.getFieldProps('role')}
                onChange={formik.handleChange}
                value={formik.values.role}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                {props?.roles?.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                id="password"
                fullWidth
                {...formik.getFieldProps('password')}
                onChange={formik.handleChange}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            disabled={created}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}
