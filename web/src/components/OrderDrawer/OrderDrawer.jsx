import { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import XIcon from '@untitled-ui/icons-react/build/esm/X'
import PropTypes from 'prop-types'

import { OrderDetails } from '../OrderDetails/OrderDetails'
import { OrderEdit } from '../OrderEdit/OrderEdit'

export const OrderDrawer = (props) => {
  const { container, onClose, open, order, onApprove } = props
  const [isEditing, setIsEditing] = useState(false)

  const handleEditOpen = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleEditCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  const isOpen = () => {
    // if drawer closed, put into background
    return !open
      ? { zIndex: -1 }
      : {
          zIndex: 1,
        }
  }

  let content = null

  if (order) {
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
          <Typography color="inherit" variant="h5">
            Order Details
          </Typography>
          <Typography color="inherit" variant="h6">
            {order.number}
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
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
          <OrderDetails
            onApprove={onApprove}
            onEdit={handleEditOpen}
            onClose={onClose}
            order={order}
          />
        </Box>
      </div>
    )
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
  )
}

OrderDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  order: PropTypes.object,
}
