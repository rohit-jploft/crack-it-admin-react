import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, Fragment } from 'react';
// @mui
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Icon,
} from '@mui/material';
// components
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST, { getUsers } from '../data/user';
import { getAllMeeting } from '../data/meetings';
import { getTimeFromTimestamps, getDateFromTimeStamps } from '../utils/helper';
import { MeetingSortByStatus, BlogPostsSearch } from '../sections/@dashboard/blog/index';
import { deleteCategory, getCategories } from '../data/categories';
import AddCategory from './AddCategory';
import DeleteAlert from '../components/DeleteAlert';
import { BASE_URL } from '../constant';
import NoPhoto from '../images/noPhoto.jpg';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'image', label: 'Image', alignRight: false },
  { id: 'createdAt', label: 'CreatedAt', alignRight: false },
  { id: 'updatedAt', label: 'UpdatedAt', alignRight: false },
  { id: 'Categories', label: 'Categories', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: false },
  { id: 'delete', label: 'Delete', alignRight: false },
];
const TABLE_HEAD_WITHOUT_IMAGE = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'parent', label: 'Parent', alignRight: false },
  { id: 'createdAt', label: 'CreatedAt', alignRight: false },
  { id: 'updatedAt', label: 'UpdatedAt', alignRight: false },
  { id: 'Categories', label: 'Categories', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: false },
  { id: 'delete', label: 'Delete', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Categories() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDone, setEditDone] = useState(false);

  // my state
  const [categoriesData, setCategoriesData] = useState([]);
  const [newCategoryClicked, setNewCategoryClicked] = useState(false);
  const [search, setSearch] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);
  const [showCatClicked, setShowCatClicked] = useState(false);
  const [created, setCreated] = useState(false);
  const [showDeleteDailog, setDeleteDailog] = useState(false);
  const [editCategory, setEditCategory] = useState({});
  const [parentCategory, setParentCategory] = useState('');
  const [totalCount, setTotalCount] = useState();
  const [isParentExist, setParentExist] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState('');
  const [showButtonCount, setShowButtonCount] = useState(0);
  useEffect(() => {
    (async () => {
      setIsDeleted(false);
      setEditDone(false);
      let parent = '';
      if (categoryId) parent = categoryId;
      const categories = await getCategories(parent, search, rowsPerPage, page);
      console.log(categories, 'categories');
      setTotalCount(categories.pagination.totalCount);
      setCategoriesData(categories.data);
      if (categories.data && categories.data[0].parent.title) {
        setParentExist(true);
      } else {
        setParentExist(false);
      }
    })();
  }, [search, isDeleted, showCatClicked, created, categoryId, editDone, rowsPerPage, page]);
  useEffect(() => {
    if (categoryId) setParentCategory(categoryId);
  }, [newCategoryClicked]);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    // setPage(0);
    setSearch(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  // delete category
  const deleteCat = async (id) => {
    const del = await deleteCategory(id);
    console.log(del);
    if (del.status === 200) {
      toast('Category deleted successfully', {
        type: 'success',
        autoClose: 400,
        onClose: () => {
          setIsDeleted(true);
          setSelectedDeleteId('');
        },
      });
    }
    setIsDeleted(false);
    setSelectedDeleteId('');
  };

  return (
    <>
      <Helmet>
        <title> Categories </title>
      </Helmet>
      <ToastContainer />
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          sx={{ marginBottom: -0.03, marginLeft: '30px', marginRight: '30px' }}
        >
          <Typography variant="h4" gutterBottom>
            {/* {newCategoryClicked
              ? editCategory.id
                ? 'Edit category'
                : ' Add Category'
              : categoryId
              ? parentCategory === categoryId
                ? 'Sub category'
                : 'skills'
              : 'Categories'} */}
            {showButtonCount === 0 && 'Categories'}
            {showButtonCount === 1 && 'Sub Categories'}
            {showButtonCount === 2 && 'Skills'}
          </Typography>
          {newCategoryClicked && (
            <Icon
              onClick={() => {
                setNewCategoryClicked(false);
                setEditCategory({});
              }}
              style={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Icon>
          )}
        </Stack>
        {!newCategoryClicked && (
          <Stack
            mb={5}
            direction="row"
            alignItems="center"
            justifyContent={categoryId ? 'space-between' : 'space-between'}
            sx={{
              marginBottom: -0.06,
            }}
          >
            {/* <BlogPostsSearch posts={[]} /> */}
            {categoryId && (
              <Button
                style={{ color: 'black' }}
                onClick={() => {
                  setShowButtonCount(0);
                  navigate('/dashboard/categories');
                  // window.location.reload();
                }}
              >
                <ArrowBackIcon style={{ marginRight: '5px' }} />
                Main Page
              </Button>
            )}
            <UserListToolbar
              numSelected={selected.length}
              filterName={search}
              onFilterName={(value) => setSearch(value)}
            />
            {!newCategoryClicked && (
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => {
                  setNewCategoryClicked(true);
                  setEditCategory({});
                }}
              >
                {showButtonCount === 0 && 'Add Category'}
                {showButtonCount === 1 && 'Add Sub Category'}
                {showButtonCount === 2 && 'Add Skills'}
                {/* {categoryId ? (parentCategory === categoryId ? 'Add Job role' : 'Add Skills') : 'Add Category'} */}
              </Button>
            )}
          </Stack>
        )}{' '}
        {!newCategoryClicked && (
          <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={!categoryId ? TABLE_HEAD : TABLE_HEAD_WITHOUT_IMAGE}
                    rowCount={categoriesData.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />

                  <TableBody className="table-bodys">
                    {categoriesData?.map((row) => {
                      const { _id, title, createdAt, updatedAt, image } = row;
                      const selectedUser = selected.indexOf(_id) !== -1;
                      return (
                        <Fragment key={_id}>
                          <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                        </TableCell> */}

                            <TableCell component="th" scope="row" padding="none" className="row-data">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {/* <Avatar /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {title}
                                </Typography>
                              </Stack>
                            </TableCell>

                            {!categoryId && (
                              <TableCell align="left">
                                <img
                                  src={image ? `${BASE_URL}${image}` : NoPhoto}
                                  alt="category-logo"
                                  style={{ height: '70px', width: '100px' }}
                                />
                              </TableCell>
                            )}
                            {categoryId && <TableCell align="left">{row?.parent?.title}</TableCell>}
                            <TableCell align="left">{getDateFromTimeStamps(createdAt.toString())}</TableCell>

                            <TableCell align="left">{getDateFromTimeStamps(updatedAt.toString())}</TableCell>

                            {/* <TableCell align="left">{getDateFromTimeStamps(date.toString())}</TableCell>
                        <TableCell align="left">{getTimeFromTimestamps(startTime.toString())}</TableCell>
                        <TableCell align="left">{getTimeFromTimestamps(endTime.toString())}</TableCell> */}

                            <TableCell align="left">
                              {showButtonCount < 2 && (
                                <Button
                                  onClick={() => {
                                    setShowButtonCount(showButtonCount + 1);
                                    setShowCatClicked(false);
                                    navigate(`/dashboard/categories/${_id}`);
                                  }}
                                >
                                  {showButtonCount === 0 && 'Show Sub Categories'}
                                  {showButtonCount === 1 && 'Show Skills'}
                                </Button>
                              )}
                            </TableCell>

                            {/* <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell> */}
                            <TableCell align="left">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => {
                                  setEditCategory({ id: _id, parent: parentCategory, title });
                                  setNewCategoryClicked(true);
                                }}
                              >
                                <Iconify icon={'eva:edit-fill'} />
                              </IconButton>
                            </TableCell>
                            <TableCell align="left">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => {
                                  setDeleteDailog(true);
                                  setSelectedDeleteId(_id);
                                }}
                              >
                                <Iconify icon={'eva:trash-2-outline'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          {showDeleteDailog && (
                            <DeleteAlert
                              title={'Delete'}
                              onConfirmDelete={() => deleteCat(selectedDeleteId)}
                              open={showDeleteDailog}
                              onClose={() => setDeleteDailog(false)}
                            />
                          )}
                        </Fragment>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {categoriesData.length === 0 && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            {/* <Typography variant="h6" paragraph>
                              Not found
                            </Typography> */}

                            <Typography variant="body2">
                              No results found
                              {/* <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words. */}
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
        {newCategoryClicked && (
          <AddCategory
            edit={editCategory}
            parentid={categoryId}
            editDone={(value) => setEditDone(value)}
            close={(value) => setNewCategoryClicked(value)}
            isDone={(value) => setCreated(value)}
            showFilePicker={!categoryId}
          />
        )}
      </Container>

      {!newCategoryClicked && (
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      )}
    </>
  );
}
