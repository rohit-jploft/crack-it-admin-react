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
} from '@mui/material';
import * as Yup from 'yup'; // Import Yup for validation
import { makeStyles } from '@mui/styles';
import { ErrorMessage, useFormik } from 'formik';
import { useParams } from 'react-router-dom';

import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUser } from '../data/user';
import { createCategory, updateCategory } from '../data/categories';

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
  title: Yup.string().min(3).required('title is required'),
});
export default function AddCategory(props) {
  const { categoryId } = useParams();
  const classes = useStyles();
  const [created, setCreated] = useState(false);
  const [image, setImage] = useState();
  const initialTitle = props.edit.title ? props.edit.title : '';
  console.log(props.edit, 'edit cate');
  const formik = useFormik({
    initialValues: {
      title: initialTitle,
    },
    validationSchema,
    onSubmit: async (values) => {
    //   setCreated(true);
      // alert(JSON.stringify(values, null, 2));
      const obj = {};
      if (categoryId) obj.parent = categoryId;
      if (values.title) obj.title = values.title.toString();
      if(image) obj.image = image
      const res = props.edit.id ? await updateCategory(props.edit.id, obj) : await createCategory(obj);
      if (res?.data && res.data?.data.title) {
        setCreated(true);
        // props.editDone(true)
        toast.success(res.data.message, {
          onClose: () => {
            props.close(false);
            props.isDone(true);
          },
          autoClose: 800,
        });
        // props.close(false);
      }
      if (res?.type === 'error' && res?.status === 200) toast(res.message, { type: 'error' });
      setCreated(false);
      props.isDone(true);
      props.editDone(true)
    },
  });
  const fileInputRef = useRef(null);



  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type;
      const acceptedTypes = ["image/*"];
      if (acceptedTypes.some((type) => fileType.match(type))) {
        // File type is valid, you can handle the file here
        console.log("Selected file:", selectedFile);
        setImage(selectedFile);
      } else {
        toast.error(
          "Invalid file type. Please select an  image file."
        );
        setImage();
        fileInputRef.current.value = "";
      }
    }
  };

 
  const handleIconClick = () => {
    // Trigger the file input when the icon is clicked
    fileInputRef.current.click();
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
        <Typography component="h1" variant="h5">
          {props.edit.id ? 'Edit Category' : 'Add Category'}
        </Typography>
        <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                id="title"
                {...formik.getFieldProps('title')}
                onChange={formik.handleChange}
                value={formik.values.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
           {props.showFilePicker && <Grid item xs={12} sm={12}>
              <TextField
                name="image"
                // label="Image"
                type="file"
                ref={fileInputRef}
                onClick={handleIconClick}
                fullWidth
                id="image"
                {...formik.getFieldProps('image')}
                onChange={handleFileInputChange}
                error={!image}
                helperText={!image && "Image is required"}
              />
            </Grid>}
          </Grid>
          <Button
            disabled={created}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {props.edit.id ? 'Edit ' : 'Create '} Category
          </Button>
        </form>
      </div>
    </Container>
  );
}
