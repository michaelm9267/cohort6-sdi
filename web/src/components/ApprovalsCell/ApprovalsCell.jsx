import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Fragment, useState, useEffect } from 'react';
import { SeverityPill } from '../../../../template/src/components/severity-pill';
import { subDays, subHours } from 'date-fns';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const statusMap = {
  parts: 'info',
  users: 'info',
};

export const QUERY = gql`
  query approvalsFilter($status: String, $page: Int, $rowsPerPage: Int, $query: String, $sort: String) {
    approvalsFilter(status: $status, page: $page, rowsPerPage: $rowsPerPage, query: $query, sort: $sort) {
      paginatedApprovals {
        ... on Part {
          id
          nomenclature
          nsn
          partNumber
          cageCode
          status
          unitOfIssue
          unitPrice
          isg
        }
        ... on User {
          id
          firstName
          lastName
          rank
          status
          shop {
            address
            city
            state
            zip
            name
          }
          created
        }
      }
      totalCount
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>No Pending Approvals</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  approvalsFilter, // filters pending parts AND users
  updateApprovalsInStore,
  onPageChange,
  onRowsPerPageChange,
  onSelect,
  page,
  rowsPerPage,
  status, // status determines if part/user needs approval
  openSnack,
  msg,
  handleCloseSnack,
}) => {

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  useEffect(() => {
    updateApprovalsInStore(pendingOnly); // pendingPartsFilter.paginatedApprovals
  }, [approvalsFilter, page, rowsPerPage])

  // filters parts/users to trigger useEffect re-render
  var pendingOnly = []
  if (status === "parts") {
    console.log("parts?")
    console.log(approvalsFilter.paginatedApprovals)
    pendingOnly = approvalsFilter.paginatedApprovals.filter((part) => (part.status === "parts"))
  } else if (status === "users") {
    console.log("users?")
    console.log(approvalsFilter.paginatedApprovals)
    pendingOnly = approvalsFilter.paginatedApprovals.filter((user) => (user.status === "users"))
  }

  const snaccbar = () => {
    if (pendingOnly.length === 0) {
      return <>
        <Box sx={{ p: 3 }}><Typography variant="h6" color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}>No Pending Approvals</Typography></Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message={msg}
          action={action}
        />
      </>
    } else {
      return <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message={msg}
        action={action}
      />
    }
  }

  // conditionally prints row contents per part/user
  const handleStatus = (approval) => {
    if (status === "users") {
      console.log(approval)
      const dateString = approval.created
      const date = Date.parse(dateString, "yyyy-MM-dd'T'HH:mm:ss'Z'");
      const createdAtMonth = format(date, 'LLL').toUpperCase();
      const createdAtDay = format(date, 'dd');
      return <>
        <TableCell
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.200',
              borderRadius: 2,
              maxWidth: 'fit-content',
              ml: 3,
              p: 1,
            }}
          >
            <Typography
              align="center"
              variant="subtitle2"
            >
              {createdAtMonth}
            </Typography>
            <Typography
              align="center"
              variant="h6"
            >
              {createdAtDay}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Typography>
            Rank/Name: {approval.rank + ' ' + approval.firstName + ' ' + approval.lastName}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>
            Shop: {approval.shop.name}
          </Typography>
        </TableCell>
      </>
    } else if (status === "parts") {
      return <>
        <TableCell>
          <Typography>
            Part Name: {approval.nomenclature}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>
            NSN: {approval.nsn}
          </Typography>
        </TableCell>
      </>
    }
  }

  return (
    <div>
      <Table sx={{ minWidth: 1200 }}>
        <TableBody>
          {pendingOnly.map((approval) => {
            const statusColor = statusMap[approval.status] || 'warning';

            return (
              <TableRow
                hover
                key={approval.id}
                onClick={() => onSelect?.(approval.id)}
                sx={{ cursor: 'pointer' }}
              >
                {handleStatus(approval)}
                <TableCell align="right">
                  <SeverityPill color={statusColor}>{approval.status}</SeverityPill>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {snaccbar()}
      <TablePagination
        component="div"
        count={approvalsFilter.totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  )
}
