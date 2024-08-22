import { useEffect, useState, Fragment } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import numeral from 'numeral'
import PropTypes from 'prop-types'

import { TextAreaField, Form } from '@redwoodjs/forms'
import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { SeverityPill } from '../../../../template/src/components/severity-pill'
import { PropertyList } from '../../components/PropertyList'
import { PropertyListItem } from '../../components/PropertyListItem'
import Modal from '../Modal/Modal'
import { useDialog } from '../../../../template/src/hooks/use-dialog'

const statusMap = {
  canceled: 'error',
  completed: 'success',
  pending: 'info',
  approved: 'info',
  returned: 'error',
}

const MUTATION = gql`
  mutation updateOrderInOrders($id: Int!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      texCode
      sd
      projectCode
      rdd
      dueOutDoc
      orderStatus
      addedToInventory
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
    }
  }
`
const QUERY_TRANSPORT = gql`
  query shopUsersTransport {
    shopUsersTransport {
      id
    }
  }
`
const INVENTORY_QUERY = gql`
  query shopInventoryByPartId($partId: Int, $shopID: Int!) {
    shopInventoryByPartId(partId: $partId, shopID: $shopID) {
      id
      quantity
      maxQuantity
    }
  }
`

const INVENTORY_CREATE = gql`
  mutation createShopinventory($input: CreateShopinventoryInput!) {
    createShopinventory(input: $input) {
      partId
      quantity
      shopID
    }
  }
`

const INVENTORY_UPDATE = gql`
  mutation updateShopinventoryAtOrders(
    $id: Int!
    $input: UpdateShopinventoryInput!
  ) {
    updateShopinventory(id: $id, input: $input) {
      partId
      quantity
      shopID
    }
  }
`

const CREATE_ORDER = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      shopID
      userID
      partId
      orderQuantity
      ujc
      jcn
      shipTo
      wuc
      toRef
    }
  }
`

export const OrderDetails = (props) => {
  const { onApprove, order, onClose } = props
  const [status, setStatus] = useState('')
  const align = 'vertical'
  const dateString = order.orderDate
  const date = Date.parse(dateString, "yyyy-MM-DD'T'HH:mm:ss'Z'")
  const createdAt = format(date, 'yyyy-MM-dd HH:mm')
  const statusColor = statusMap[order.orderStatus] || 'primary'
  const numberPrice = parseFloat(order.part.unitPrice.replace(/,/g, ''))
  const totalAmount = numeral(numberPrice * order.orderQuantity).format(
    `($0,0)`
  )
  const [updateOrder] = useMutation(MUTATION)
  const { data: dataAdmin } = useQuery(QUERY_ADMIN)
  const { data: dataTransport } = useQuery(QUERY_TRANSPORT)
  const { data: dataInventory, refetch } = useQuery(INVENTORY_QUERY, {
    variables: { partId: order.partId, shopID: order.shopID },
  })
  const [createShopinventory] = useMutation(INVENTORY_CREATE)
  const [updateShopinventory] = useMutation(INVENTORY_UPDATE)
  const { currentUser, hasRole } = useAuth()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [jcn, setJcn] = useState('')
  const [toRef, setToRef] = useState('')
  const dialog = useDialog()
  const [ujc, setUjc] = useState('')
  const [markFor, setMarkFor] = useState('')
  const [wuc, setWuc] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [msg, setMsg] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [createOrder] = useMutation(CREATE_ORDER)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [formEditErrors, setFormEditErrors] = useState({
    jcn: '',
    toRef: '',
    ujc: '',
    markFor: '',
    wuc: '',
    quantity: '',
  })
  const [formOrderErrors, setFormOrderErrors] = useState({
    jcn: '',
    ujc: '',
    markFor: '',
    quantity: '',
  })

  const openAddModal = async () => setIsAddOpen(true)
  const closeAddModal = () => setIsAddOpen(false)

  const validateOrder = () => {
    let isValid = true
    const errors = {}

    if (!jcn || !jcn.trim()) {
      isValid = false
      errors.jcn = 'JCN is required'
    }

    if (!markFor || !markFor.trim()) {
      isValid = false
      errors.markFor = 'Site/Aircraft/Benchstock is required'
    }

    if (quantity === 0) {
      isValid = false
      errors.quantity = 'Quantity must be greater than 0'
    }

    setFormOrderErrors(errors)
    return isValid
  }
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
    onClose()
  }
  const approverInfo =
    currentUser.roles === 'admin'
      ? currentUser.rank +
        ' ' +
        currentUser.firstName +
        ' ' +
        currentUser.lastName
      : ''
  const todayDate = new Date().toDateString()
  const [createNotification] = useMutation(CREATE_NOTIFICATION)
  const submitterInfo =
    currentUser.roles === 'basic'
      ? currentUser.rank +
        ' ' +
        currentUser.firstName +
        ' ' +
        currentUser.lastName
      : ''

  useEffect(() => {
    if (order.jcn !== null && isEditModalOpen) {
      setJcn(order.jcn)
    }
    if (order.toRef !== null && isEditModalOpen) {
      setToRef(order.toRef)
    }
    if (order.ujc !== null && isEditModalOpen) {
      setUjc(order.ujc)
    }
    if (order.markFor !== null && isEditModalOpen) {
      setMarkFor(order.markFor)
    }
    if (order.wuc !== null && isEditModalOpen) {
      setWuc(order.wuc)
    }
    if (order.orderQuantity !== null && isEditModalOpen) {
      setQuantity(order.orderQuantity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, isEditModalOpen])

  const handleApprove = (event) => {
    event.preventDefault()
    onApprove(order)
  }

  const openOrderModal = async () => {
    setIsOrderOpen(true)
  }
  const closeOrderModal = () => setIsOrderOpen(false)

  const handleOrderAgain = async () => {
    if (validateOrder()) {
      const input = {
        shopID: currentUser.shopID,
        userID: currentUser.id,
        partId: order.partId,
        orderQuantity: parseInt(quantity),
        ujc: ujc,
        wuc: order.wuc,
        markFor: markFor,
        jcn: jcn,
        toRef: order.toRef,
      }
      await createOrder({ variables: { input: input } })
      setIsOrderOpen(false)
      setMsg('Your order was successfully added to your cart!')
      setOpenSnack(true)
    }
  }

  const handleAddToInventory = async () => {
    refetch({ partId: order.partId, shopID: order.shopID })
    if (dataInventory.shopInventoryByPartId === null) {
      const input = {
        partId: order.partId,
        quantity: order.orderQuantity < 100 ? order.orderQuantity : 100,
        shopID: order.shopID,
      }
      await createShopinventory({
        variables: { input: input },
      })
      await updateOrder({
        variables: { id: order.id, input: { addedToInventory: true } },
      })
      setIsAddOpen(false)
      if (order.orderQuantity >= 100) {
        setMsg(
          'Order exceeded max quantity. Quantity in inventory was automatically adjusted to max quantity limit.'
        )
      } else {
        setMsg(
          `Order# ${order.orderNumber} was added to inventory successfully!`
        )
      }
      setOpenSnack(true)
    } else {
      const input = {
        partId: order.partId,
        quantity:
          dataInventory.shopInventoryByPartId.quantity + order.orderQuantity <
          dataInventory.shopInventoryByPartId.maxQuantity
            ? dataInventory.shopInventoryByPartId.quantity + order.orderQuantity
            : dataInventory.shopInventoryByPartId.maxQuantity,
        shopID: order.shopID,
      }
      await updateShopinventory({
        variables: {
          id: dataInventory.shopInventoryByPartId.id,
          input: input,
        },
      })
      await updateOrder({
        variables: { id: order.id, input: { addedToInventory: true } },
      })
      setIsAddOpen(false)
      if (
        dataInventory.shopInventoryByPartId.quantity + order.orderQuantity >=
        dataInventory.shopInventoryByPartId.maxQuantity
      ) {
        setMsg(
          'Max quantity for item has been reached. Quantity not added to inventory.'
        )
      } else {
        setMsg(
          `Order# ${order.orderNumber} was added to inventory successfully!`
        )
      }
      setOpenSnack(true)
    }
  }

  const handleReturn = async (event) => {
    event.preventDefault()
    const input = {
      orderStatus: 'returned',
      message: message,
    }
    const notificationsMessage = `order #${order.orderNumber} was stamped returned by ${approverInfo} on ${todayDate}`
    await updateOrder({
      variables: { id: order.id, input: input },
    })
    setModalOpen(false)
    setMsg('Order was returned successfully!')
    setOpenSnack(true)
    order.shop.users.map((user) => {
      createNotification({
        variables: {
          input: {
            userID: user.id,
            orderID: order.id,
            message: notificationsMessage,
          },
        },
      })
    })
  }

  const handleResubmit = async () => {
    if (validateEditOrder()) {
      const input = {
        jcn: jcn,
        toRef: toRef,
        ujc: ujc,
        markFor: markFor,
        wuc: wuc,
        orderQuantity: quantity,
        message: '',
        orderStatus: 'pending',
      }
      const notificationsMessage = `order #${order.orderNumber} was stamped pending by ${submitterInfo} on ${todayDate}`
      updateOrder({ variables: { id: order.id, input: input } })
      dataAdmin.shopUsersAdmin.map((user) => {
        createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: order.id,
              message: notificationsMessage,
            },
          },
        })
      })
      setIsEditModalOpen(false)
      setMsg('Order was submitted successfully!')
      setOpenSnack(true)
    }
  }

  const handleSubmit = async () => {
    const input = {
      orderStatus: status,
    }
    const notificationsMessage = `order# ${order.orderNumber} was stamped ${status} by ${approverInfo} on ${todayDate}`
    await updateOrder({
      variables: { id: order.id, input: input },
    })
    setMsg(`Order# ${order.orderNumber} was updated to ${status} successfully!`)
    setOpenSnack(true)
    order.shop.users.map((user) => {
      createNotification({
        variables: {
          input: {
            userID: user.id,
            orderID: order.id,
            message: notificationsMessage,
          },
        },
      })
    })
    dataAdmin.shopUsersAdmin.map((user) => {
      createNotification({
        variables: {
          input: {
            userID: user.id,
            orderID: order.id,
            message: notificationsMessage,
          },
        },
      })
    })
    if (
      status === 'completed' ||
      status === 'canceled' ||
      status === 'in transit' ||
      status === 'awaiting pickup'
    ) {
      dataTransport.shopUsersTransport.map((user) => {
        createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: order.id,
              message: notificationsMessage,
            },
          },
        })
      })
    }
  }

  const handleQDR = async () => {
    await updateOrder({
      variables: {
        id: order.id,
        input: { addedToInventory: true },
      },
    })
    setIsAddOpen(false)
    setMsg(`Order# ${order.orderNumber} was successfully closed!`)
    setOpenSnack(true)
  }

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
  )

  const validateEditOrder = () => {
    let isValid = true
    const errors = {}

    if (!jcn || !jcn.trim()) {
      isValid = false
      errors.jcn = 'JCN is required'
    }

    if (!toRef || !toRef.trim()) {
      isValid = false
      errors.toRef = 'T.O. Reference is required'
    }

    if (!markFor || !markFor.trim()) {
      isValid = false
      errors.markFor = 'Site/Aircraft/Benchstock is required'
    }

    if (!wuc || !wuc.trim()) {
      isValid = false
      errors.wuc = 'Work Unit Code is required'
    }

    if (quantity === 0) {
      isValid = false
      errors.quantity = 'Quantity must be greater than 0'
    }

    setFormEditErrors(errors)
    return isValid
  }

  const handleStatus = (event) => {
    setStatus(event.target.value)
  }

  const openEditModal = () => setIsEditModalOpen(true)
  const closeEditModal = () => setIsEditModalOpen(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          {order.orderStatus !== 'pending' &&
          order.orderStatus !== 'returned' &&
          order.orderStatus !== 'cancelled' &&
          currentUser.roles === 'admin' ? (
            <>
              <Button
                color="info"
                onClick={handleApprove}
                size="small"
                variant="contained"
              >
                View 2005
              </Button>
            </>
          ) : (
            <></>
          )}
        </Stack>
        <Box sx={{ maxHeight: '65vh', overflow: 'auto' }}>
          <PropertyList>
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Order Number"
              value={order.orderNumber}
            />
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Customer"
            >
              <Typography color="text.secondary" variant="body2">
                {order.user.rank +
                  ' ' +
                  order.user.firstName +
                  ' ' +
                  order.user.lastName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {order.shop.address}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {order.shop.city +
                  ', ' +
                  order.shop.state +
                  ', ' +
                  order.shop.zip}
              </Typography>
            </PropertyListItem>
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Date"
              value={createdAt}
            />
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Part Name"
              value={order.part.nomenclature}
            />
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Quantity"
              value={order.orderQuantity}
            />
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Total Amount"
              value={totalAmount}
            />
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Job Control Number"
              value={order.jcn}
            />
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Work Unit Code"
              value={order.wuc}
            />
            {order.dueInDoc !== null ? (
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Due In Document Number"
                value={order.dueInDoc}
              />
            ) : (
              <></>
            )}
            {order.dueOutDoc !== null ? (
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Due Out Document Number"
                value={order.dueOutDoc}
              />
            ) : (
              <></>
            )}
            {order.rdd !== null ? (
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Requested Delivery Date"
                value={order.rdd}
              />
            ) : (
              <></>
            )}
            {order.ujc !== '' ? (
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="UJC"
                value={order.ujc}
              />
            ) : (
              <></>
            )}
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="DODAAC"
              value={order.shop.dodaac}
            />
            {order.texCode !== null ? (
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Tex Code"
                value={order.texCode}
              />
            ) : (
              <></>
            )}
            {order.priority !== null ? (
              <PropertyListItem
                align={align}
                disableGutters
                divider
                label="Priority"
                value={order.priority}
              />
            ) : (
              <></>
            )}
            <PropertyListItem
              align={align}
              disableGutters
              divider
              label="Status"
            >
              <SeverityPill color={statusColor}>
                {order.orderStatus}
              </SeverityPill>
            </PropertyListItem>
          </PropertyList>
        </Box>
        {hasRole('admin') || hasRole('transport') ? (
          order.orderStatus === 'pending' ? (
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              justifyContent="flex-end"
              spacing={2}
            >
              <Button
                onClick={handleApprove}
                size="small"
                variant="contained"
                color="success"
              >
                Approve
              </Button>
              <Button
                color="error"
                onClick={openModal}
                size="small"
                variant="contained"
              >
                Return
              </Button>
              <Modal
                open={isModalOpen}
                onClose={closeModal}
                content={
                  <Form>
                    <TextAreaField
                      name="message"
                      fullWidth
                      rows={15}
                      cols={50}
                      placeholder="Write reason for returning here..."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                  </Form>
                }
                actions={<Button onClick={handleReturn}>Submit</Button>}
              />
            </Stack>
          ) : order.orderStatus === 'returned' ||
            order.orderStatus === 'canceled' ||
            order.orderStatus === 'completed' ? (
            <></>
          ) : (
            <Box display="flex" flexWrap="wrap" justifyContent="flex">
              <FormControl>
                <InputLabel id="statusUpdate">Update Status</InputLabel>
                <Select
                  labelId="updateStatus"
                  label="Update Status"
                  value={status}
                  onChange={handleStatus}
                  sx={{ marginRight: 1, width: '13.93vw' }}
                >
                  <MenuItem value={'canceled'}>Canceled</MenuItem>
                  <MenuItem value={'in transit'}>In Transit</MenuItem>
                  <MenuItem value={'completed'}>Completed</MenuItem>
                  <MenuItem value={'awaiting pickup'}>Awaiting Pickup</MenuItem>
                </Select>
              </FormControl>
              <Button onClick={handleSubmit} color="info" variant="contained">
                Submit
              </Button>
            </Box>
          )
        ) : hasRole('basic') && order.orderStatus === 'returned' ? (
          <>
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              justifyContent="flex-end"
              spacing={2}
            >
              <Button
                onClick={openEditModal}
                size="small"
                variant="contained"
                color="success"
              >
                Edit
              </Button>
            </Stack>
            <Modal
              open={isEditModalOpen}
              onClose={closeEditModal}
              content={
                <>
                  <Typography
                    sx={{ color: 'red', fontWeight: 'bold', marginBottom: 1 }}
                  >
                    {order.message}
                  </Typography>
                  <TextField
                    fullWidth
                    inputProps={{ maxLength: 9 }}
                    label="JCN"
                    placeholder="JCN"
                    error={!!formEditErrors.jcn}
                    helperText={formEditErrors.jcn}
                    sx={{
                      marginBottom: 2,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={jcn}
                    onChange={(event) => setJcn(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Site/Aircraft/Benchstock"
                    placeholder="Site/Aircraft/Benchstock"
                    error={!!formEditErrors.markFor}
                    helperText={formEditErrors.markFor}
                    sx={{
                      marginBottom: 2,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={markFor}
                    onChange={(event) => setMarkFor(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Technical Order Reference"
                    placeholder="Technical Order Reference"
                    error={!!formEditErrors.toRef}
                    helperText={formEditErrors.toRef}
                    sx={{
                      marginBottom: 2,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={toRef}
                    onChange={(event) => setToRef(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Work Unit Code"
                    placeholder="Work Unit Code"
                    error={!!formEditErrors.wuc}
                    helperText={formEditErrors.wuc}
                    sx={{
                      marginBottom: 2,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={wuc}
                    onChange={(event) => setWuc(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="UJC"
                    placeholder="UJC (If item is MICAP)"
                    sx={{
                      marginBottom: 2,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={ujc}
                    onChange={(event) => setUjc(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Quantity"
                    placeholder="Quantity"
                    error={!!formEditErrors.quantity}
                    helperText={formEditErrors.quantity}
                    type="number"
                    min={0}
                    sx={{
                      marginBottom: 2,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </>
              }
              actions={<Button onClick={() => handleResubmit()}>Submit</Button>}
            />
          </>
        ) : hasRole('basic') && order.orderStatus === 'completed' ? (
          <>
            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              justifyContent="flex-end"
              spacing={2}
            >
              <Button
                onClick={() => openAddModal()}
                size="small"
                variant="contained"
                color="success"
                disabled={order.addedToInventory === true ? true : false}
              >
                Add to Inventory
              </Button>
              <Modal
                open={isAddOpen}
                onClose={closeAddModal}
                content={
                  <>
                    <Typography>Was a QDR required for this item?</Typography>
                  </>
                }
                actions={
                  <>
                    <Button onClick={() => handleQDR()}>Yes</Button>
                    <Button onClick={() => handleAddToInventory()}>No</Button>
                  </>
                }
              />
              <Button
                size="small"
                variant="contained"
                onClick={() => openOrderModal(order)}
              >
                Order Again
              </Button>
            </Stack>
          </>
        ) : hasRole('basic') &&
          order.orderStatus !== 'pending' &&
          order.orderStatus !== 'returned' ? (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button
              size="small"
              variant="contained"
              onClick={() => openOrderModal(order)}
            >
              Order Again
            </Button>
          </Stack>
        ) : (
          <></>
        )}
        <Modal
          open={isOrderOpen}
          onClose={closeOrderModal}
          content={
            <>
              <Typography
                sx={{
                  color: 'red',
                  fontWeight: 'bold',
                  marginBottom: 1,
                }}
              >
                {order.message}
              </Typography>
              <TextField
                fullWidth
                inputProps={{ maxLength: 9 }}
                label="JCN"
                placeholder="JCN"
                error={!!formOrderErrors.jcn}
                helperText={formOrderErrors.jcn}
                sx={{
                  marginBottom: 2,
                  input: {
                    color: 'black',
                  },
                }}
                value={jcn}
                onChange={(event) => setJcn(event.target.value)}
              />
              <TextField
                fullWidth
                label="Site/Aircraft/Benchstock"
                placeholder="Site/Aircraft/Benchstock"
                error={!!formOrderErrors.markFor}
                helperText={formOrderErrors.markFor}
                sx={{
                  marginBottom: 2,
                  input: {
                    color: 'black',
                  },
                }}
                value={markFor}
                onChange={(event) => setMarkFor(event.target.value)}
              />
              <TextField
                fullWidth
                label="UJC"
                placeholder="UJC (If item is MICAP)"
                sx={{
                  marginBottom: 2,
                  input: {
                    color: 'black',
                  },
                }}
                value={ujc}
                onChange={(event) => setUjc(event.target.value)}
              />
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                placeholder="Quantity"
                error={!!formOrderErrors.quantity}
                helperText={formOrderErrors.quantity}
                sx={{
                  marginBottom: 2,
                  input: {
                    color: 'black',
                  },
                }}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </>
          }
          actions={<Button onClick={() => handleOrderAgain()}>Submit</Button>}
        />
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message={msg}
        action={action}
      />
    </Stack>
  )
}

OrderDetails.propTypes = {
  onApprove: PropTypes.func,
  onEdit: PropTypes.func,
  onClose: PropTypes.func,
  order: PropTypes.object,
}
