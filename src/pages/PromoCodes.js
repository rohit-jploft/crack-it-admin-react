import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
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
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CardContent,
  Switch,
  Icon,
} from '@mui/material';
// components
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import Label from '../components/label';
import Iconify from '../components/iconify';
import DeleteAlert from '../components/DeleteAlert';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST, { getUsers } from '../data/user';
import { getAllMeeting } from '../data/meetings';
import { getTimeFromTimestamps, getDateFromTimeStamps } from '../utils/helper';
import { MeetingSortByStatus, BlogPostsSearch } from '../sections/@dashboard/blog/index';
import { createNewPromoCode, deletePromo, getAllPromoCodes, makeActive, updatePromoCode } from '../data/promoCode';
import AddPromoCode from './AddPromoCode';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'flatAmount', label: 'Discount Amount', alignRight: false },
  { id: 'discountPercentage', label: 'Discount Percent', alignRight: false },
  { id: 'expirationDate', label: 'Expiration Date', alignRight: false },
  { id: 'createdAt', label: 'CreatetAt', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'active', label: 'Active', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: false },
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

export default function PromoCodes() {
  const { type } = useParams();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [promoCodesData, setPromoCodesData] = useState([]);
  const preStatus = type || '';
  const [status, setStatus] = useState(preStatus);

  const [search, setSearch] = useState('');
  const [activeDone, setActiveDone] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [checked, setChecked] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAddNewPromo, setShowAddNewPromo] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [totalCount, setTotalCount] = useState();

  useEffect(() => {
    (async () => {
      const promoCodes = await getAllPromoCodes(search, status);
      //   setTotalCount(withdrawal.pagination.totalCount);
      setActiveDone(false);
      setDeleted(false);
      setPromoCodesData(promoCodes.data);
    })();
  }, [status, rowsPerPage, page, search, activeDone, deleted,showAddNewPromo]);

  const handleOpenMenu = (event, _id) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const activePromo = async (codeId, data) => {
    const res = await makeActive(codeId, data);
    console.log(res);
    setActiveDone(true);
  };
  const deletePromoCode = async (codeId, data) => {
    const res = await deletePromo(codeId, data);
    console.log(res);
    setDeleted(true);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Helmet>
        <title> User</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          sx={{ marginBottom: -0.03, marginLeft: '30px', marginRight: '30px' }}
        >
          <Typography variant="h4" gutterBottom>
            {showAddNewPromo ? '' : 'Promo Codes'}
          </Typography>
          {showAddNewPromo && (
            <Icon
              onClick={() => {
                setIsEdit(false)
                setSelectedPromo('')
                setShowAddNewPromo(false);
                // setEditCategory({});
              }}
              style={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Icon>
          )}
          {!showAddNewPromo && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setIsEdit(false)
                setSelectedPromo('')
                setShowAddNewPromo(true);
                // setEditCategory({});
              }}
            >
              Add Promo Code
            </Button>
          )}
        </Stack>

        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Promo Codes
          </Typography>
        </Stack> */}
        {!showAddNewPromo && (
          <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
            {/* <BlogPostsSearch posts={[]} /> */}
            <UserListToolbar filterName={search} onFilterName={(value) => setSearch(value)} />
            <MeetingSortByStatus
              options={[
                { value: '', label: 'All' },
                { value: 'Active', label: 'Active' },
                { value: 'InActive', label: 'InActive' },
              ]}
              value={status}
              onSort={(e) => setStatus(e.target.value)}
            />
          </Stack>
        )}

        {!showAddNewPromo && (
          <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    // order={order}
                    // orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    //   onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />

                  <TableBody className="table-bodys" sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {promoCodesData?.map((row) => {
                      const { code, createdAt,type, flatAmount,discountPercentage, expirationDate, isActive, _id } = row;

                      return (
                        <>
                          <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                            {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                        </TableCell> */}

                            <TableCell component="th" scope="row" padding="none" className="row-data">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {/* <Avatar /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {code}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{type} </TableCell>
                            <TableCell align="left">{flatAmount || 'Null'} </TableCell>
                            <TableCell align="left">{discountPercentage || 'Null'} {discountPercentage ? '%' :''}</TableCell>
                            <TableCell align="left">{getDateFromTimeStamps(expirationDate)}</TableCell>

                            <TableCell align="left">{getDateFromTimeStamps(createdAt)}</TableCell>
                            {/* <TableCell align="left">{getTimeFromTimestamps(startTime.toString())}</TableCell>
                        <TableCell align="left">{getTimeFromTimestamps(endTime.toString())}</TableCell> */}

                            <TableCell align="left">
                              <Label color={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</Label>
                            </TableCell>
                            <TableCell align="left">
                              <Switch
                                checked={isActive}
                                onChange={handleChange}
                                onClick={() => activePromo(_id, { isActive: !isActive })}
                                color="success"
                              />
                            </TableCell>
                            <TableCell align="left">
                              <TableCell align="right">
                                <IconButton
                                  size="large"
                                  color="inherit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenMenu(e, _id);
                                    setSelectedPromo(_id)
                                  }}
                                >
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                </IconButton>
                              </TableCell>
                            </TableCell>
                            {/* <TableCell align="left">
                          <Button
                            className="add-proty-mn"
                            variant="contained"
                            onClick={() => {
                                setBankData(bank)
                                setOpen(true)
                            }}
                          >
                            See Bank detail
                          </Button>
                        </TableCell> */}

                            {/* <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell> */}
                          </TableRow>
                          {showDeleteAlert && (
                            <DeleteAlert
                              title={'Delete'}
                              onConfirmDelete={() => {
                                deletePromoCode(selectedPromo, { isDeleted: true });
                                handleCloseMenu();
                              }}
                              open={showDeleteAlert}
                              onClose={() => {
                                setShowDeleteAlert(false);
                                handleCloseMenu();
                              }}
                            />
                          )}
                        </>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {promoCodesData.length === 0 && (
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
        {
            showAddNewPromo && <AddPromoCode isEdit={isEdit} selectedCodeId={selectedPromo}  title="Promo Code" close={(value) => {
              
                setIsEdit(false)
                setSelectedPromo('')
                setShowAddNewPromo(value)
                
            }}/>
        }
      </Container>

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
        <MenuItem
          sx={{ color: 'main' }}
          onClick={() => {
            setIsEdit(true)
           setShowAddNewPromo(true)
           handleCloseMenu()
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          {/* {selectedUserSuspended ? 'Active' : 'Suspend'} */}
          Edit
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setShowDeleteAlert(true)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {/* {selectedUserSuspended ? 'Active' : 'Suspend'} */}
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
