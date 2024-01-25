import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Icon,
  TextField,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Axios from 'axios';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar, UserSortByRole } from '../sections/@dashboard/user';
// mock
import { getAllTickets } from '../data/ticketIssues';
import { BASE_URL } from '../constant';
import AddFeedbackComponent from '../components/AddFeedbackComponent';
import ShowMeetingDetailDailog from '../components/ShowMeetingDetailDailog';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'raised', label: 'Raised By(Email)', alignRight: false },
  { id: 'bookingId', label: 'BookingId', alignRight: false },
  { id: 'ticketNo', label: 'Ticket No', alignRight: false },
  { id: 'reason', label: 'Cancel Reason', alignRight: false },
  { id: 'query', label: 'Query', alignRight: false },
  { id: 'attachment', label: 'Attachment', alignRight: false },
  { id: 'status', label: 'status', alignRight: false },
  { id: 'feedbackByAdmin', label: 'feedbackByAdmin', alignRight: false },
  { id: 'booking', label: 'Booking Details' },
];

// ----------------------------------------------------------------------

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
  const [showfeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [isFeedbackAdded, setIsFeedbackAdded] = useState(false);
  const [isStatusChnaged, setIsStatusChanged] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState('');



  const [meetingDetailDailog, setMeetingDetailDailog] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState('')
  const [expertName, setExpertName] = useState("")
  const [userName, setUserName] = useState("")
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
      setIsFeedbackAdded(false);
      setIsStatusChanged(false);
      const tickets = await getAllTickets(statusFilter, search, page, rowsPerPage);

      console.log(tickets, 'res');
      setTotalCount(tickets.pagination.totalCount);
      setTicketsData(tickets.data);
    })();
  }, [statusFilter, search, page, rowsPerPage, isFeedbackAdded, isStatusChnaged]);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const statusChangeFun = async (ticketId, statusValue) => {
    const changeStatus = await Axios.put(`${BASE_URL}ticket/update/status/${ticketId}`, { status: statusValue });
    console.log(changeStatus, 'change');
    if (changeStatus && changeStatus.data && changeStatus.data.success) {
      toast.success('Status changed');
    } else {
      toast.error(changeStatus.data.message);
    }
  };

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
                      const { reason, query, _id, user, status, ticketNo, attachment, booking, feedbackByAdmin } = row;

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
                            <TableCell align="left">{booking?.bookingId}</TableCell>
                            <TableCell align="left">{ticketNo}</TableCell>

                            <TableCell align="left">{reason?.reason}</TableCell>

                            <TableCell align="left">{query}</TableCell>
                            <TableCell align="left">
                              <Button
                                variant="contained"
                                onClick={() => attachment ? window.open(`${BASE_URL}${attachment}`, '_blank') : alert("No Attachment")}
                              >
                                Open
                              </Button>
                            </TableCell>
                            <TableCell align="left">
                              {/* {' '}
                              <Label color={status === 'OPEN' || status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                                {sentenceCase(status)}
                              </Label> */}
                              <TextField
                                select
                                disabled={feedbackByAdmin && status === 'RESOLVED'}
                                size="small"
                                defaultValue=""
                                label="status"
                                value={status}
                                onChange={(e) => {
                                  if (e.target.value !== status) {
                                    statusChangeFun(_id, e.target.value);
                                    setIsStatusChanged(true);
                                  }
                                }}
                                style={{ width: '200px', marginRight: '20px' }}
                              >
                                {[
                                  { value: 'OPEN', label: 'Open' },
                                  { value: 'RESOLVED', label: 'Resolved' },
                                  { value: 'IN_PROGRESS', label: 'In-progress' },
                                ].map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell align="left">
                              {feedbackByAdmin || (
                                <Button
                                  onClick={() => {
                                    setShowFeedbackDialog(true);
                                    setSelectedTicketId(_id);
                                  }}
                                >
                                  Add Feedback
                                </Button>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                onClick={() => {
                                  setSelectedMeetingId(booking?._id);
                                  setMeetingDetailDailog(true);
                                  setExpertName(`${booking?.booking?.expert?.firstName} ${booking?.booking?.expert.lastName}`);
                                  setUserName(`${user?.firstName} ${user.lastName}`);
                                }}
                              >
                                See Details
                              </Button>
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
      <ShowMeetingDetailDailog userName={userName}  open={meetingDetailDailog} setOpen={(value) => setMeetingDetailDailog(value)} meetingId={selectedMeetingId}/>
      {showfeedbackDialog && (
        <AddFeedbackComponent
          onAddFeedback={() => console.log('pressed')}
          onClose={() => setShowFeedbackDialog(false)}
          open={showfeedbackDialog}
          ticketId={selectedTicketId}
          isFeedbackAdded={setIsFeedbackAdded}
        />
      )}
    </>
  );
}
