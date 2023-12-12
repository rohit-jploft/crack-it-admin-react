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
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUser } from '../data/user';
import { createNewPromoCode, getSinglePromoCodeDetail, updatePromoCode } from '../data/promoCode';

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
  code: Yup.string().required('Code is required'),
  type: Yup.string().required('Type is required').oneOf(['PERCENT', 'FLAT']),
  discountPercentage: Yup.number(),
  flatAmount: Yup.number(),
  expirationDate: Yup.date().required('Expiration date is required'),
});
export default function AddPromoCode(props) {
  const classes = useStyles();
  const [created, setCreated] = useState(false);
  const [editData, setEditData] = useState();

  const getEditData = async (id) => {
    if (props.isEdit) {
      const res = await getSinglePromoCodeDetail(id);
      console.log(res.data, 'single promo data');
      formik.setFieldValue('code', res.data.code);
      formik.setFieldValue('type', res.data.type);
      if (res.data.type === 'FLAT') {
        formik.setFieldValue('flatAmount', res.data.flatAmount);
      } else {
        formik.setFieldValue('discountPercentage', res.data.discountPercentage);
      }

      const currentDate = new Date(res.data.expirationDate);

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      formik.setFieldValue('expirationDate', formattedDate);
      setEditData(res.data);
    } else {
      formik.setFieldValue('code', '');
      formik.setFieldValue('discountPercentage', '');
      formik.setFieldValue('expirationDate', '');
    }
  };
  useEffect(() => {
    console.log(props.selectedCodeId, 'selected id');
    console.log(props.isEdit, 'isEdit');
    if (props.selectedCodeId && props.isEdit) {
      getEditData(props.selectedCodeId);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      code: '',
      type: 'PERCENT',
      flatAmount: '',
      discountPercentage: '',
      expirationDate: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const dataobj = {
        code: values.code,
        type: values.type,
        expirationDate: values.expirationDate,
      };
      if (values.type === 'PERCENT') {
        dataobj.discountPercentage = values.discountPercentage;
      }
      if (values.type === 'FLAT') {
        dataobj.flatAmount = values.flatAmount;
      }
      const res = props.isEdit ? await updatePromoCode(props.selectedCodeId, {...values}) : await createNewPromoCode(dataobj);
      console.log(res);

      if (res && res.status === 200 && res.success) {
        toast.success(res.message);
        props.close(false);
      }
      if (res && !res.success) {
        toast.error(res.message);
      }
      if (res && !res.success) {
        toast.error(res.message);
      }
      //     setCreated(true);
      //     // alert(JSON.stringify(values, null, 2));
      //     const res = await createUser(values, dailCode, props.isAdmin);
      //     console.log(res, 'response signup');
      //     if(res.response && res.response.data){
      //       toast.error(res.response.data.message, {

      //         autoClose: 800,
      //       });
      //     }
      //     if (res?.data && res.data?.userId) {
      //       toast.success(res.message, {
      //         onClose: () => {
      //           setCreated(false);
      //           props.close(false);
      //         },
      //         autoClose: 800,
      //       });
      //
      //     }
      //     if (res?.type === 'error' && res?.status === 200) toast(res.message, { type: 'error' });
      //     setCreated(false);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {/* Add New {props.title} */}
          {props.isEdit ? 'Edit Promo code' : 'Add new promo code'}
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="code"
                label="Promo-Code"
                id="code"
                {...formik.getFieldProps('code')}
                onChange={formik.handleChange}
                value={formik.values.code}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                options
                fullWidth
                name="type"
                label="type"
                id="type"
                {...formik.getFieldProps('type')}
                onChange={formik.handleChange}
                value={formik.values.type}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {[
                  { label: 'Percent', value: 'PERCENT' },
                  { label: 'Flat', value: 'FLAT' },
                ].map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12}>
              {formik.values.type === 'FLAT' ? (
                <TextField
                  fullWidth
                  style={{ width: '100%' }}
                  name="flatAmount"
                  type="number"
                  label="Flat Discount Amount"
                  id="flatAmount"
                  {...formik.getFieldProps('flatAmount')}
                  onChange={formik.handleChange}
                  value={formik.values.flatAmount}
                  error={formik.touched.flatAmount && Boolean(formik.errors.flatAmount)}
                  helperText={formik.touched.flatAmount && formik.errors.flatAmount}
                />
              ) : (
                <TextField
                  fullWidth
                  style={{ width: '100%' }}
                  name="discountPercentage"
                  type="number"
                  label="Dsicount Percent"
                  id="discountPercentage"
                  {...formik.getFieldProps('discountPercentage')}
                  onChange={formik.handleChange}
                  value={formik.values.discountPercentage}
                  error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                  helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="expirationDate"
                label="Expiry Date"
                id="expirationDate"
                type="date"
                fullWidth
                {...formik.getFieldProps('expirationDate')}
                onChange={formik.handleChange}
                value={formik.values.expirationDate}
                error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                focused
              />
            </Grid>
          </Grid>
          <Button
            disabled={created}
            type="submit"
            fullWidth
            // onClick={(e) => {
            //     e.preventDefault()
            //     formik.handleSubmit()
            // }}
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
