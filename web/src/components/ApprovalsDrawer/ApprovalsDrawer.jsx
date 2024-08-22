import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery } from '@redwoodjs/web';
import ApprovalsDetails from '../ApprovalsDetails/ApprovalsDetails';
// import { useAuth } from 'src/auth';

const UPDATE_PART = gql`
  mutation updatePart($id: Int!, $input: UpdatePartInput!){
    updatePart(id: $id, input: $input){
      id
    }
  }
`

const UPDATE_USER = gql`
  mutation updateUser($id: Int!, $input: UpdateUserInput!){
    updateUser(id: $id, input: $input){
      id
    }
  }
`

const DELETE_PART = gql`
  mutation deletePart($id: Int!){
    deletePart(id: $id){
      id
    }
  }
`

const DELETE_USER = gql`
  mutation deleteUser($id: Int!){
    deleteUser(id: $id){
      id
    }
  }
`

const ApprovalsDrawer = (props) => {
  const { container, onClose, open, approval, onSubmit } = props;
  const [updatePart] = useMutation(UPDATE_PART);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deletePart] = useMutation(DELETE_PART);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleSubmit = async () => {
    try {
      let response = null;
      let type = null;
      if (approval.status === "parts") {
        response = await updatePart({ variables: { id: approval.id, input: { status: "approved" } } })
        type = "part"
      } else if (approval.status === "users") {
        response = await updateUser({ variables: { id: approval.id, input: { status: "approved" } } })
        type = "user"
      }
      console.log('Mutation response:', response) // step 2
      await onSubmit(type + " approved")
    } catch (error) {
      console.error('Mutation error:', error)
    }
  }

  const handleDelete = async () => {
    try {
      let response = null;
      let type = null;
      if (approval.status === "parts") {
        response = await deletePart({ variables: { id: approval.id }, })
        console.log("deleting part")
        console.log(approval)
        type = "part"
      } else if (approval.status === "users") {
        response = await deleteUser({ variables: { id: approval.id }, })
        console.log("deleting user")
        console.log(approval)
        type = "user"
      }
      console.log("DELETE_PART step 1 (cart drawer")
      console.log('Mutation response:', response)
      await onSubmit(type + " deleted")
    } catch (error) {
      console.error('Mutation error:', error)
    }
  }

  const isOpen = () => {
    // if drawer closed, put into background
    return !open ? { zIndex: -1 } : { zIndex: 1 }
  }

  let content = null;

  if (approval) {
    content = (
      <div>
        <Stack
          alignItems="end"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 1,
          }}
        >
          <Typography
            color="inherit"
            variant="h5"
          >
            Details
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 3,
            py: 1,
          }}
        >
          <ApprovalsDetails
            onSubmit={handleSubmit}
            onReject={handleDelete}
            approval={approval}
          />
        </Box>
      </div>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      PaperProps={{
        sx: {
          position: 'relative',
          width: 500,
        },
      }}
      SlideProps={{ container }}
      variant="persistent"
      sx={isOpen}
    >
      {content}
    </Drawer>
  );
};

ApprovalsDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  approval: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default ApprovalsDrawer