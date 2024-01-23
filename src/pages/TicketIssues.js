import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { PersonOffOutlined, Person2Outlined } from '@mui/icons-material';
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
  Icon,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar, UserSortByRole } from '../sections/@dashboard/user';
// mock
import USERLIST, { getUsers, suspendAccount } from '../data/user';
import { MeetingSortByStatus, BlogPostsSearch } from '../sections/@dashboard/blog/index';
import SignUp from './SignUpPage';
import DeleteAlert from '../components/DeleteAlert';
import ShowExpertProfileDialog from '../components/ShowExpertProfileDailog';
import { getAllTickets } from '../data/ticketIssues';
import { BASE_URL } from '../constant';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'ticketNo', label: 'Ticket No', alignRight: false },
  { id: 'reason', label: 'Reason', alignRight: false },
  { id: 'query', label: 'Query', alignRight: false },
  { id: 'attachment', label: 'Attachment', alignRight: false },
  { id: 'status', label: 'status', alignRight: false },
  //   { id: 'booking', label: 'Booking Details' },
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

export default function TicketsPage() {
  const { userType } = useParams();
  const [suspendId, setSuspenId] = useState('');
  const [open, setOpen] = useState(null);
  const [showDeleteDailog, setDeleteDailog] = useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [ticketsData, setTicketsData] = useState([]);

  // pre selected role
  const preRole = userType || '';

  const [statusFilter, setStatusFilter] = useState('');
  const [clickedRole, setClickedRole] = useState();
  const [isExprofileVerified, setIsExProfileVerified] = useState(false);
  const [showProfileDialog, setShowProfileDailog] = useState(false);
  const [search, setSearch] = useState('');
  const [newUserClicked, setNewUserClicked] = useState(false);
  const [suspendDone, setSuspendDone] = useState(false);
  const [selectedUserSuspended, setSelectedUserSuspended] = useState(false);
  const [totalCount, setTotalCount] = useState();

  useEffect(() => {
    (async () => {
      const tickets = await getAllTickets(statusFilter, search);

      console.log(tickets, 'res');
      setTotalCount(tickets.pagination.totalCount);
      setTicketsData(tickets.data);
    })();
  }, [statusFilter, search, page, rowsPerPage]);

  const suspendUserAccount = async (userId, isDeleted) => {
    setSuspendDone(true);
    handleCloseMenu();

    const res = await suspendAccount(userId, selectedUserSuspended);
    console.log(res);
    if (res && res?.success && res?.status === 200) {
      toast.success(res.message);
    }
    setSuspendDone(false);
  };
  const handleOpenMenu = (event, id, isDeleted, role, verified) => {
    setOpen(event.currentTarget);
    setSuspenId(id);
    setClickedRole(role);
    setSelectedUserSuspended(isDeleted);
    setIsExProfileVerified(verified);
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

  return (
    <>
      <Helmet>
        <title> Tickets </title>
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
            Ticket Issues
          </Typography>
          {newUserClicked && (
            <Icon onClick={() => setNewUserClicked(false)} style={{ cursor: 'pointer' }}>
              <CloseIcon />
            </Icon>
          )}
        </Stack>

        {!newUserClicked && (
          <Card>
            <Stack
              mb={5}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                marginBottom: -0.5,
              }}
            >
              <UserListToolbar
                numSelected={selected.length}
                filterName={search}
                onFilterName={setSearch}
                placeholderAddition="Ticket No"
              />
              <UserSortByRole
                options={[
                  { value: '', label: 'All' },
                  { value: 'OPEN', label: 'Open' },
                  { value: 'IN_PROGRESS', label: 'InProgress' },
                  { value: 'RESOLVED', label: 'Resolved' },
                ]}
                onSort={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                label={'Status'}
              />
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={ticketsData.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody className="table-bodys">
                    {ticketsData?.map((row) => {
                      const { reason, query, _id, user, status, ticketNo , attachment} = row;

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
                                  {user?.firstName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{user?.email}</TableCell>
                            <TableCell align="left">{ticketNo}</TableCell>

                            <TableCell align="left">{reason?.reason}</TableCell>

                            <TableCell align="left">{query}</TableCell>
                            <TableCell align="left">
                              <Button variant="contained" onClick={() => window.open(`${BASE_URL}${attachment}`, '_blank')}>
                                Open
                              </Button>
                            </TableCell>
                            <TableCell align="left">
                              {' '}
                              <Label color={status === 'OPEN' || status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                                {sentenceCase(status)}
                              </Label>
                            </TableCell>
                          </TableRow>
                          {/* {showDeleteDailog && (
                            <DeleteAlert
                              title={selectedUserSuspended ? 'Activate Account' : 'Inactivate Account'}
                              onConfirmDelete={() => suspendUserAccount(suspendId, isDeleted)}
                              open={showDeleteDailog}
                              onClose={() => setDeleteDailog(false)}
                              opacity={"0.5"}
                            />
                          )} */}
                        </>
                      );
                    })}
                    {/* {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )} */}
                  </TableBody>

                  {ticketsData.length === 0 && (
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
                              {/* <br /> Try checking for typos or using complete words. */}
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
      </Container>
      <ShowExpertProfileDialog
        open={showProfileDialog}
        setOpen={(value) => setShowProfileDailog(value)}
        userId={suspendId}
      />
      {newUserClicked && (
        <SignUp
          title="Expert"
          isAdmin={false}
          close={(value) => setNewUserClicked(value)}
          roles={[{ value: 'EXPERT', label: 'Expert' }]}
        />
      )}
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
        {clickedRole === 'EXPERT' && isExprofileVerified && (
          <MenuItem
            sx={{ color: 'grey.main' }}
            onClick={() => {
              setShowProfileDailog(true);
              handleCloseMenu();
            }}
          >
            See Profile
          </MenuItem>
        )}
        <MenuItem
          sx={{ color: selectedUserSuspended ? 'success.main' : 'error.main' }}
          onClick={() => {
            setDeleteDailog(true);
          }}
        >
          {/* <Iconify icon={'eva:user-2-outline'} sx={{ mr: 2 }} /> */}
          {selectedUserSuspended ? (
            <Person2Outlined sx={{ marginRight: '4px' }} />
          ) : (
            <PersonOffOutlined sx={{ marginRight: '4px' }} />
          )}
          {selectedUserSuspended ? 'Active' : 'InActive'}
        </MenuItem>
      </Popover>
    </>
  );
}
