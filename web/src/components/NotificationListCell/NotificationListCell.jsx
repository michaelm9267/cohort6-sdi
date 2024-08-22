import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { SeverityPill } from '../../../../template/src/components/severity-pill';
import { TableHead } from '@mui/material';
import { useUpdateEffect } from '../../../../template/src/hooks/use-update-effect';
import { set } from '@redwoodjs/forms';
import { useQuery } from '@redwoodjs/web';
import { useAuth } from 'web/src/auth';

export const QUERY = gql`
  query notification {
    notifications {
      id
      read
      created
      message
      user {
        rank
        lastName
        shopID
      }
      order {
        orderStatus
        part {
          nomenclature
        }
      }
    }
  }
`;



export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ notifications }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth();


  const filteredNotifications = notifications.filter(notes => currentUser.shopID === notes.user.shopID === false)
  return (
    <Card>
    <CardHeader
      title="Notifications"
      subheader="list of notifications"
      sx={{ pb: 0 }}
    />

    <Divider />
      <Table sx={{ height: 'fit-content' }}>
        <TableHead>
          <TableRow>
            <TableCell variant="h6">POC</TableCell>
            <TableCell variant="h6">Status</TableCell>
            <TableCell variant="h6">Message</TableCell>
            <TableCell variant="h6">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredNotifications.map((notes, index) => (
        <TableRow
          key={index}
          hover
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell sx={{width: '25%'}}>
            <Box
              sx={{
                p: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100',
                borderRadius: 2,
                maxWidth: 'fit-content',
              }}
            >
              <Typography
                align="center"
                color="text.primary"
                variant="caption"
              >
                {/* You can put some data here */}
              </Typography>
              <Typography align="center" color="text.primary" variant="subtitle2">

              {notes.user.rank + " " + notes.user.lastName}

              </Typography>
            </Box>
          </TableCell>

          <TableCell sx={{width: '25%'}}>

              <Typography variant="subtitle2">{notes.order.orderStatus}</Typography>

          </TableCell>

          <TableCell>

              <Typography variant="subtitle2">{notes.message}</Typography>

          </TableCell>

          <TableCell>

              <Typography variant="subtitle2">{notes.created}</Typography>

          </TableCell>


        </TableRow>
      ))}
    </TableBody>
  </Table>
</Card>
  );
};