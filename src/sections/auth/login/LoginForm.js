import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import * as Yup from 'yup'; // Import Yup for validation
import { useFormik } from 'formik';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Axios from 'axios';

// components
import Iconify from '../../../components/iconify';
import { BASE_URL } from '../../../constant';
// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});
export default function LoginForm() {
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setCreated(true);
      // alert(JSON.stringify(values, null, 2));
      const res = await Axios.post(`${BASE_URL}auth/user/login`, {
        email: formik.values.email,
        password: formik.values.password,
        role: 'ADMIN',
      });
      console.log(res?.data, 'response login');
      if (res?.data && res.data?.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('userId', res.data.data.user._id);

        toast.success(res.data.message, {
          onClose: () => {
            navigate('/dashboard', { replace: true });
          },
          autoClose: 500,
        });
        setCreated(false);
      }
      if (res?.data && res?.data?.type === 'error') {
        toast(res.data.message, { type: 'error' });
        setCreated(false);
      }
    },
  });
  // const handleClick = async () => {
  //   const res = await Axios.post(`${BASE_URL}auth/user/login`, { email, password });

  //   if (res.status === 200) {
  //     toast('Login Successfull', { type: 'success' });
  //     localStorage.setItem('token', res.data.data.token);
  //     navigate('/dashboard', { replace: true });
  //   }
  // };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'email') {
  //     setEmail(value);
  //   }
  //   if (name === 'password') {
  //     setPassword(value);
  //   }
  // };

  return (
    <>
      <ToastContainer />
      <Stack spacing={3}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="email"
                label="Email address"
                {...formik.getFieldProps('email')}
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
                onChange={formik.handleChange}
                fullWidth
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
            <Grid item xs={12} sm={12}>
              <LoadingButton
                disabled={created}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={formik.handleSubmit}
              >
                Login
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
}
