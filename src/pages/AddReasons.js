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
import DeleteAlert from '../components/DeleteAlert';
import AddReasonDailogComponent from '../components/AddReasonDailogComponent';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'reason', label: 'Reason' },
  { id: 'role', label: 'Role' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'delete' },
  //   { id: 'booking', label: 'Booking Details' },
];

// ----------------------------------------------------------------------

export default function ReasonsPage() {
  const { userType } = useParams();
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [reasonsData, setReasonsData] = useState([]);
  const [isFeedbackAdded, setIsFeedbackAdded] = useState(false);
  const [isStatusChnaged, setIsStatusChanged] = useState(false);

  const [showDeleteDailog, setShowDeleteDailog] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState('');
  const [isActionDone, setIsActionDone] = useState(false);
  const [showEditDailog, setShowEditDailog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [reasonRole, setReasonRole] = useState("USER");
  const [reasonValue, setReasonValue] = useState('');

  // pre selected role

  const [search, setSearch] = useState('');
  const [newUserClicked, setNewUserClicked] = useState(false);
  const [totalCount, setTotalCount] = useState();

  useEffect(() => {
    (async () => {
      setIsFeedbackAdded(false);
      setIsStatusChanged(false);
      setIsActionDone(false);
      const reasons = await Axios.get(`${BASE_URL}ticket/reason/get-all?page=${page}&limit=${rowsPerPage}`);

      console.log(reasons, 'res');
      setTotalCount(reasons.data.pagination.totalCount);
      setReasonsData(reasons.data.data);
    })();
  }, [page, rowsPerPage, isActionDone]);

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
  const deleteReasonFun = async (reasonId) => {
    const reasonCheck = await Axios.put(`${BASE_URL}ticket/reason/delete/${reasonId}`);
    console.log(reasonCheck, 'change');
    if (reasonCheck && reasonCheck.data && reasonCheck.data.success) {
      setIsActionDone(true);
      toast.success('Reason deleted successfully');
    } else {
      toast.error(reasonCheck.data.message);
    }
  };
  const editReasonFun = async (reasonId, reasonvalue) => {
    const reasonCheck = await Axios.put(`${BASE_URL}ticket/reason/update/${reasonId}`, { reason: reasonvalue, role:reasonRole });
    console.log(reasonCheck, 'change');
    if (reasonCheck && reasonCheck.data && reasonCheck.data.success) {
      setIsActionDone(true);
      setIsEdit(false);
      toast.success('Reason updated successfully');
    } else {
      setIsEdit(false);
      toast.error(reasonCheck.data.message);
    }
  };
  const AddNewReason = async (reasonvalue) => {
    const reasonCheck = await Axios.post(`${BASE_URL}ticket/reason/create`, { reason: reasonvalue , role:reasonRole});
    console.log(reasonCheck, 'change');
    if (reasonCheck && reasonCheck.data && reasonCheck.data.success) {
      setIsActionDone(true);
      toast.success('Reason Added successfully');
    } else {
      toast.error(reasonCheck.data.message);
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
        />

        <Card>
          <Stack
            mb={5}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              margin: 2.5,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Issues Reasons
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              // sx={{margin:"20px"}}
              onClick={() => {
                setIsEdit(false);
                setShowEditDailog(true);
                setReasonValue('');
              }}
            >
              Add new Reason
            </Button>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={reasonsData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody className="table-bodys">
                  {reasonsData?.map((row) => {
                    const { reason, _id, role } = row;

                    return (
                      <>
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                        </TableCell> */}

                          <TableCell component="th" scope="row" padding="none" className="row-data">
                            {reason}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none" className="row-data">
                            {role}
                          </TableCell>

                          <TableCell align="left">
                            {' '}
                            <Iconify
                              onClick={() => {
                                // setShowDeleteDailog(true);
                                setIsEdit(true);
                                setReasonValue(reason);
                                setShowEditDailog(true);
                                setSelectedReasonId(_id);
                              }}
                              icon={'eva:edit-fill'}
                              sx={{ mr: 2, cursor: 'pointer' }}
                            />
                          </TableCell>
                          <TableCell align="left">
                            {' '}
                            <Iconify
                              onClick={() => {
                                setShowDeleteDailog(true);

                                setSelectedReasonId(_id);
                              }}
                              icon={'eva:trash-2-outline'}
                              sx={{ mr: 2, cursor: 'pointer' }}
                            />
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

                {reasonsData.length === 0 && (
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
          {showDeleteDailog && (
            <DeleteAlert
              open={showDeleteDailog}
              itemName={'Reason'}
              title={'Delete'}
              onClose={() => setShowDeleteDailog(false)}
              onConfirmDelete={() => deleteReasonFun(selectedReasonId)}
            />
          )}
          {showEditDailog && (
            <AddReasonDailogComponent
              open={showEditDailog}
              onClose={() => setShowEditDailog(false)}
              isEdit={isEdit}
              reasonValue={reasonValue}
              setReasonValue={(value) => setReasonValue(value)}
              setReasonRole={(value) => setReasonRole(value)}
              reasonRole={reasonRole}
              onEditReason={() => editReasonFun(selectedReasonId, reasonValue)}
              onAdd={() => AddNewReason(reasonValue)}
            />
          )}
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
    </>
  );
}
