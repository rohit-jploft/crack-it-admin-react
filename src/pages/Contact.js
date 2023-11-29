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
} from '@mui/material';
// components
import ChatIcon from '@mui/icons-material/Chat';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';

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
import { getAllWithDrawal } from '../data/withdrawReq';
import { BASE_URL } from '../constant';
import { getAllContactLeads } from '../data/contact';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'message', label: 'Message', alignRight: false },
  { id: 'createAt', label: 'createAt', alignRight: false },

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

export default function ContactLeads() {
  const { type } = useParams();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [contactLeadsData, setContactLeadsData] = useState([]);
  const preStatus = type || '';
  const [status, setStatus] = useState(preStatus);
  const [totalCount, setTotalCount] = useState();
  const [bankData, setBankData] = useState();
  const [selectedId, setSelectedId] = useState();
  const [search, setSearch] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    (async () => {
      const leadData = await getAllContactLeads(search, page, rowsPerPage);
      setTotalCount(leadData.pagination.totalCount);
      setIsDone(false)

      setContactLeadsData(leadData.data);
    })();
  }, [search, rowsPerPage, page, isDone]);

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
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const marketPaymentAsPaid = async (id) => {
    try {
      const res = await Axios.put(`${BASE_URL}wallet/withdrawal/update/status/${id}`, { status: 'Approved' });
      setIsDone(true)
      console.log(res);
    } catch (error) {
       toast(error.message);
    }
  };

  return (
    <>
    <ToastContainer/>
      <Helmet>
        <title> User</title>
      </Helmet>

      <Container>
      
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          {/* <BlogPostsSearch posts={[]} /> */}
          <Typography variant="h4" gutterBottom>
           Contacts Us Leads
          </Typography>
          <UserListToolbar numSelected={selected.length} filterName={search} onFilterName={setSearch} />

        </Stack>

        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />

                <TableBody className="table-bodys" sx={{ maxHeight: '400px', overflow: 'auto' }}>
                  {contactLeadsData?.map((row) => {
                    const { name, email, phone, message, createdAt , _id} = row;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                        </TableCell> */}

                        <TableCell component="th" scope="row" padding="none" className="row-data">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar /> */}
                            <Typography variant="subtitle2" noWrap>
                              {name} 
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">+{phone}</TableCell>
                        <TableCell align="left">{message}</TableCell>

                        <TableCell align="left">{getDateFromTimeStamps(createdAt)}</TableCell>
                        {/* <TableCell align="left">{getTimeFromTimestamps(startTime.toString())}</TableCell>
                        <TableCell align="left">{getTimeFromTimestamps(endTime.toString())}</TableCell> */}

                        {/* <TableCell align="left">
                          <Label color={status === 'Approved' ? 'success' : 'error'}>{sentenceCase(status)}</Label>
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            className="add-proty-mn"
                            variant="contained"
                            onClick={() => {
                              setBankData(bank);
                              setOpen(true);
                              setSelectedId(_id)
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
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {contactLeadsData.length === 0 && (
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
      </Container>

      <Dialog open={open}>
        <DialogTitle>Bank Deatils Of Withraw request</DialogTitle>
        <DialogContent>
          <CardContent>
            {/* <Typography variant="h6" component="div">
              {bankData?.type}
            </Typography> */}
            <Stack>
              {bankData?.type === 'UPI' && (
                <Typography variant="h6" color="text.secondary">
                  <b>UPI ID</b> : {bankData?.upiId}
                </Typography>
              )}
              {bankData?.type === 'BANK' && (
                <Typography variant="h6" color="text.secondary">
                  <b>Bank Name</b> : {bankData?.bankName} <br />
                  <b>Account Name</b> : {bankData?.accountName} <br />
                  <b>Account No</b> : {bankData?.accountNo} <br />
                  <b>IFSC Code</b> : {bankData?.ifscCode}
                </Typography>
              )}
              {/* {<Typography variant="h6" color="text.secondary">
                <b>Amount</b>:
              </Typography>} */}
            </Stack>
          </CardContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMenu}>Close</Button>
          <Button variant="contained" onClick={async() => {
            handleCloseMenu()
            await marketPaymentAsPaid(selectedId)
            setIsDone(true)

          }}>
            Paid
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
