import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { Scrollbar } from '../../../../template/src/components/scrollbar';
import Popover from '@mui/material/Popover';
import ListItem from '@mui/material/ListItem';
import Bell01Icon from '@untitled-ui/icons-react/build/esm/Bell01';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from 'web/src/auth';
import Link from '@mui/material/Link'

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
      userID
      order {
        orderStatus
        part {
          nomenclature
        }
      }
    }
  }
`;

const UPDATE_NOTIFICATION_READ_STATUS = gql`
  mutation updateNotificationReadStatus($id: ID!) {
    updateNotificationReadStatus(id: $id) {
      id
      read
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
);

export const Success = ({ notifications }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null); // State for anchor element
  const [updateNotificationReadStatus] = useMutation(UPDATE_NOTIFICATION_READ_STATUS);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element when opening popover
  };
  const handleClose = () => {
    setAnchorEl(null); // Clear anchor element when closing popover
  };

  const handleRemoveNotification = async (id) => {
    try {
      // Update the notification's read status to true
      await updateNotificationReadStatus({
        variables: { id }
      });
    } catch (error) {
      console.error('Error updating notification read status:', error);
    }
  };
    // Function to format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); 
    };

  //gets notification based off of the current user's shop
  const filteredNotifications = notifications.filter(notes => currentUser.id === notes.userID && notes.read === false);

  return (
    <div>
      <IconButton onClick={handleOpen}> {/* Use handleOpen for click event */}
        <Badge color="error" badgeContent={filteredNotifications.length}> {/* Show number of notifications */}
          <SvgIcon>
            <Bell01Icon />
          </SvgIcon>
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
          flexWrap: 'wrap',
        }}

        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography
          color="inherit"
          variant="h6"
          padding={2}
        >
          Notifications
        </Typography>
        
          {filteredNotifications.map((notes, index) => (
            <ListItem sx={{ margin: 0, padding: 0 }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    visibility: 'visible',
                    bgcolor: 'white',
                    color: 'grey.800',
                    borderBottom: '1px solid',
                    borderColor: 'grey.300',
                    width: 300
                  }}
                >

                  <Typography sx={{ mr: 1, padding: 1 }} variant="body2" >
                    {notes.user.rank + " " + notes.user.lastName}
                    <IconButton sx={{
                        position: 'absolute',
                        top: 1,
                        right: 10,
                        zIndex:100,
                        }} onClick={() => handleRemoveNotification(notes.id)}> {/* Call handleRemoveNotification with notification id */}
                      <CloseIcon sx={{}} />
                    </IconButton> <br />
                    <Link href='/shop-orders' sx={{textDecoration: 'none', color: 'black'}}>
                      <Typography fontSize={12}>
                      {'Part Name: ' + notes.order.part.nomenclature} <br />
                      
                      {notes.message + ": "}
                      <span style={{ color: notes.order.orderStatus === 'pending' ? 'blue' : 'red' }}>{notes.order.orderStatus}</span> <br /> {/* Apply color based on condition */}
                      {formatDate(notes.created)}
                    </Typography>
                    </Link>
                  </Typography>

                </Box>

              

            </ListItem>
          ))}
          <a href='/list-of-notifications'>
            <Typography sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              See all notifications
            </Typography>
          </a>
      </Popover>
    </div>
  );
};
