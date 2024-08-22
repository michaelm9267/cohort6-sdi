import { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import XIcon from '@untitled-ui/icons-react/build/esm/X'
import PropTypes from 'prop-types'

import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import CartDetails from '../CartDetails/CartDetails'
import CartEdit from '../CartEdit/CartEdit'

const MUTATION = gql`
  mutation updateOrder($id: Int!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      dodaac
      orderQuantity
      ujc
      wuc
      orderStatus
    }
  }
`

const DELETION = gql`
  mutation deleteOrder($id: Int!) {
    deleteOrder(id: $id) {
      id
    }
  }
`

const CREATE_NOTIFICATION = gql`
  mutation createNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
      userID
      orderID
      message
    }
  }
`
const QUERY_ADMIN = gql`
  query shopUsersAdmin {
    shopUsersAdmin {
      id
      email
    }
  }
`

const CartDrawer = (props) => {
  const { container, onClose, open, order, onSubmit } = props
  const [isEditing, setIsEditing] = useState(false)
  const todayDate = new Date().toDateString()
  const { currentUser } = useAuth()
  const submitterInfo =
    currentUser.roles === 'basic'
      ? currentUser.rank +
        ' ' +
        currentUser.firstName +
        ' ' +
        currentUser.lastName
      : ''

  const { data } = useQuery(QUERY_ADMIN)
  const [createNotification] = useMutation(CREATE_NOTIFICATION)
  const [updateOrder] = useMutation(MUTATION)
  const [deleteOrder] = useMutation(DELETION)

  const handleEditOpen = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleEditCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleSave = async (fillables) => {
    setIsEditing(false)
    try {
      const response = await updateOrder({
        variables: { id: order.id, input: fillables },
      })
      console.log('Mutation response:', response)
    } catch (error) {
      console.error('Mutation error:', error)
    }
  }

  const handleSubmit = async () => {
    const notificationsMessage = `order #${order.orderNumber} was stamped pending by ${submitterInfo} on ${todayDate}`
    try {
      const response = await updateOrder({
        variables: { id: order.id, input: { orderStatus: 'pending' } },
      })
      console.log('Mutation response:', response) // step 2
      data.shopUsersAdmin.map((user) => {
        const notificationsResponse = createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: order.id,
              message: notificationsMessage,
            },
          },
        })
        console.log('Muatation response: ', notificationsResponse)
      })
      await onSubmit(false)
    } catch (error) {
      console.error('Mutation error:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await deleteOrder({ variables: { id: order.id } })
      console.log('deletion step 1 (cart drawer')
      console.log('Mutation response:', response)
      await onSubmit(true)
    } catch (error) {
      console.error('Mutation error:', error)
    }
  }

  const isOpen = () => {
    return !open ? { zIndex: -1 } : { zIndex: 1 }
  }

  let content = null

  if (order) {
    content = (
      <div>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 1,
          }}
        >
          <Typography color="inherit" variant="h5">
            Details
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
          {!isEditing ? (
            <CartDetails
              onSubmit={handleSubmit}
              onEdit={handleEditOpen}
              onReject={handleDelete}
              order={order}
            />
          ) : (
            <CartEdit
              onCancel={handleEditCancel}
              onSave={handleSave}
              order={order}
            />
          )}
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

CartDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  order: PropTypes.object,
  onSubmit: PropTypes.func,
}

export default CartDrawer
