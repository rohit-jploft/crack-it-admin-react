import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
// components
import ChatIcon from '@mui/icons-material/Chat';
import { ToastContainer, toast } from 'react-toastify';

import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import 'react-toastify/dist/ReactToastify.css';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST, { getUsers } from '../data/user';
import { enterChatAdmin, getAllMeeting } from '../data/meetings';
import { getTimeFromTimestamps, getDateFromTimeStamps } from '../utils/helper';
import { MeetingSortByStatus, BlogPostsSearch } from '../sections/@dashboard/blog/index';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'expert', label: 'Expert', alignRight: false },
  { id: 'user', label: 'User', alignRight: false },
  { id: 'JobCategory', label: 'Job Category', alignRight: false },
  { id: 'Date', label: 'date', alignRight: false },
  { id: 'startTime', label: 'Start Time', alignRight: false },
  { id: 'endTime', label: 'End Time' },
  { id: 'status', label: 'Status' },
  { id: 'chat', label: 'Chat' },
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

export default function MeetingsPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [meetingsData, setMeetingsData] = useState([]);
  const preStatus = type || '';
  const [status, setStatus] = useState(preStatus);
  const [totalCount, setTotalCount] = useState();

  useEffect(() => {
    (async () => {
      const meetings = await getAllMeeting(status, rowsPerPage, page);
      console.log(meetings, 'meeting');
      setTotalCount(meetings.pagination.totalCount);
      setMeetingsData(meetings.data);
    })();
  }, [status, rowsPerPage, page]);

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
  const enterChat = async (meetingId) => {
    const res = await enterChatAdmin(meetingId);
    console.log(res);
    if (res && res.data && res.data.chat) {
      navigate(`dashboard/chat/${res.data.chat}`);
    }
    if (res && res.status === 200 && res.message) {
      toast.success(res.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <Helmet>
        <title> User</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Meeting
          </Typography>
        </Stack>
        <Stack mb={5} direction="row" alignItems="center" justifyContent="flex-end">
          {/* <BlogPostsSearch posts={[]} /> */}

          <MeetingSortByStatus
            options={[
              { value: '', label: 'All' },
              { value: 'REQUESTED', label: 'Requested' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'DECLINED', label: 'Declined' },
              { value: 'CONFIRMED', label: 'Confirmed' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
            value={status}
            onSort={(e) => setStatus(e.target.value)}
          />
        </Stack>

        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

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
                  {meetingsData?.map((row) => {
                    const { _id, jobCategory, user, expert, date, startTime, endTime, status } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                        </TableCell> */}

                        <TableCell component="th" scope="row" padding="none" className="row-data">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar /> */}
                            <Typography variant="subtitle2" noWrap>
                              {expert.firstName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          {' '}
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar /> */}
                            <Typography variant="subtitle2" noWrap>
                              {user.firstName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{jobCategory?.title}</TableCell>

                        <TableCell align="left">{getDateFromTimeStamps(date.toString())}</TableCell>
                        <TableCell align="left">{getTimeFromTimestamps(startTime.toString())}</TableCell>
                        <TableCell align="left">{getTimeFromTimestamps(endTime.toString())}</TableCell>

                        <TableCell align="left">
                          <Label color={status === 'CONFIRMED' ? 'success' : 'error'}>{sentenceCase(status)}</Label>
                        </TableCell>
                        <TableCell align="left">
                          {status === 'CONFIRMED' ? (
                            <IconButton onClick={() => enterChat(_id)}>
                              <ChatIcon />
                            </IconButton>
                          ) : (
                            'No Chat'
                          )}
                        </TableCell>

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

                {meetingsData.length === 0 && (
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
        {/* <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Cancel
        </MenuItem>
      </Popover>
    </>
  );
}
