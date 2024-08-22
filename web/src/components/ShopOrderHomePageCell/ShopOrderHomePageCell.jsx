import { useEffect, useState, Fragment } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import numeral from 'numeral'

import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { SeverityPill } from '../../../../template/src/components/severity-pill'
import Modal from '../Modal/Modal'

const statusMap = {
  completed: 'success',
  pending: 'info',
  canceled: 'error',
  returned: 'error',
  approved: 'info',
}

export const QUERY = gql`
  query FindShopOrderHomePageQuery($shopID: Int!, $orderStatus: String) {
    shopOrderHomePage(shopID: $shopID, orderStatus: $orderStatus) {
      id
      orderNumber
      orderDate
      orderStatus
      shop {
        id
        name
        phone
        address
        city
        state
        zip
        orgCode
        shopCode
        owner
      }
      shopID
      user {
        id
        email
        firstName
        lastName
        rank
        shopID
        roles
      }
      userID
      part {
        id
        nomenclature
        nsn
        partNumber
        cageCode
        unitOfIssue
        unitPrice
        isg
        commodityCode
        shelfLifeCode
        typeCargoCode
        hazardousMaterialCode
        rid
        location
        nmfc
        description
        manufacturer
      }
      partId
      orderQuantity
      dueInDoc
      dueOutDoc
      rdd
      ujc
      dodaac
      texCode
      sd
      projectCode
      demandCode
      wuc
      markFor
      toRef
      jcn
      message
      addedToInventory
    }
  }
`
const MUTATION = gql`
  mutation updateOrderAtHome($id: Int!, $input: UpdateOrderInput!) {
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
  mutation updateShopinventoryAtHome(
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div></div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  shopOrderHomePage,
  onSelect,
  shopID,
  orderStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jcn, setJcn] = useState('')
  const [wuc, setWuc] = useState('')
  const [markFor, setMarkFor] = useState('')
  const [toRef, setToRef] = useState('')
  const [ujc, setUjc] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState({})
  const todayDate = new Date().toDateString()
  const [openSnack, setOpenSnack] = useState(false)
  const [createNotification] = useMutation(CREATE_NOTIFICATION)
  const { data: dataAdmin } = useQuery(QUERY_ADMIN)
  const [msg, setMsg] = useState('')
  const [createOrder] = useMutation(CREATE_ORDER)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [updateOrder] = useMutation(MUTATION, {
    onCompleted: () => {
      homePageRefetch()
    },
  })
  const { currentUser, hasRole } = useAuth()
  const { refetch: homePageRefetch } = useQuery(QUERY, {
    variables: { shopID: shopID, orderStatus: orderStatus },
  })
  const [createShopinventory] = useMutation(INVENTORY_CREATE, {
    onCompleted: () => {
      homePageRefetch()
    },
  })
  const [updateShopinventory] = useMutation(INVENTORY_UPDATE, {
    onCompleted: () => {
      homePageRefetch()
    },
  })
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

  const openModal = async (order) => {
    setIsModalOpen(true)
    setSelectedOrder(order)
  }
  const closeModal = () => setIsModalOpen(false)

  const openOrderModal = async (order) => {
    setIsOrderOpen(true)
    setSelectedOrder(order)
  }
  const closeOrderModal = () => setIsOrderOpen(false)

  const openAddModal = async (order) => {
    setIsAddOpen(true)
    setSelectedOrder(order)
  }
  const closeAddModal = () => setIsAddOpen(false)

  const { data: dataInventory, refetch: inventoryFetch } = useQuery(
    INVENTORY_QUERY,
    {
      variables: { partId: selectedOrder.partId, shopID: shopID },
    }
  )

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
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

  const submitterInfo =
    currentUser.roles === 'basic'
      ? currentUser.rank +
        ' ' +
        currentUser.firstName +
        ' ' +
        currentUser.lastName
      : ''

  useEffect(() => {
    if (selectedOrder.jcn !== null && isModalOpen) {
      setJcn(selectedOrder.jcn)
    }
    if (selectedOrder.toRef !== null && isModalOpen) {
      setToRef(selectedOrder.toRef)
    }
    if (selectedOrder.ujc !== '' && isModalOpen) {
      setUjc(selectedOrder.ujc)
    }
    if (selectedOrder.markFor !== null && isModalOpen) {
      setMarkFor(selectedOrder.markFor)
    }
    if (selectedOrder.wuc !== null && isModalOpen) {
      setWuc(selectedOrder.wuc)
    }
    if (selectedOrder.orderQuantity !== null && isModalOpen) {
      setQuantity(selectedOrder.orderQuantity)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrder])

  const handleOrderAgain = async () => {
    if (validateOrder()) {
      const input = {
        shopID: currentUser.shopID,
        userID: currentUser.id,
        partId: selectedOrder.partId,
        orderQuantity: parseInt(quantity),
        ujc: ujc,
        wuc: selectedOrder.wuc,
        markFor: markFor,
        jcn: jcn,
        toRef: selectedOrder.toRef,
      }
      await createOrder({ variables: { input: input } })
      setOpenSnack(true)
      setMsg('Your order was successfully added to your cart!')
      setIsOrderOpen(false)
    }
  }

  const handleSubmit = async () => {
    if (validateEditOrder()) {
      const input = {
        jcn: jcn,
        toRef: toRef,
        ujc: ujc,
        markFor: markFor,
        wuc: wuc,
        orderQuantity: parseInt(quantity),
        message: '',
        orderStatus: 'pending',
      }
      await updateOrder({ variables: { id: selectedOrder.id, input: input } })
      const notificationsMessage = `order #${selectedOrder.orderNumber} was stamped pending by ${submitterInfo} on ${todayDate}`
      dataAdmin.shopUsersAdmin.map((user) => {
        createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: selectedOrder.id,
              message: notificationsMessage,
            },
          },
        })
      })
      setOpenSnack(true)
      setMsg(`Order# ${selectedOrder.orderNumber} was successfully submitted!`)
      setIsModalOpen(false)
    }
  }

  const handleQDR = async () => {
    await updateOrder({
      variables: {
        id: selectedOrder.id,
        input: { addedToInventory: true },
      },
    })
    setOpenSnack(true)
    setMsg(`Order# ${selectedOrder.orderNumber} was successfully closed!`)
    setIsAddOpen(false)
  }

  const handleAddToInventory = async (order) => {
    inventoryFetch({
      partId: order.partId,
      shopID: order.shopID,
    })
    if (dataInventory.shopInventoryByPartId === null) {
      const input = {
        partId: order.partId,
        quantity: order.orderQuantity < 100 ? order.orderQuantity : 100,
        shopID: order.shopID,
      }
      await createShopinventory({
        variables: { input: input },
      })
      setOpenSnack(true)
      if (order.orderQuantity >= 100) {
        setMsg(
          'Order exceeded max quantity. Quantity in inventory was automatically adjusted to max quantity limit.'
        )
      } else {
        setMsg(
          `Order# ${order.orderNumber} was added to inventory successfully!`
        )
      }
      await updateOrder({
        variables: {
          id: order.id,
          input: { addedToInventory: true },
        },
      })
      setIsAddOpen(false)
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
      setOpenSnack(true)
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
      await updateOrder({
        variables: {
          id: order.id,
          input: { addedToInventory: true },
        },
      })
      setIsAddOpen(false)
    }
  }
  return (
    <>
      {shopOrderHomePage.map((order) => {
        const dateString = order.orderDate
        const date = Date.parse(dateString, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        const createdAtMonth = format(date, 'LLL').toUpperCase()
        const createdAtDay = format(date, 'dd')
        const numberPrice = parseFloat(order.part.unitPrice.replace(/,/g, ''))
        const totalAmount = numeral(numberPrice * order.orderQuantity).format(
          `($0,0)`
        )
        const statusColor = statusMap[order.orderStatus] || 'primary'

        return (
          <TableRow
            hover
            key={order.id}
            onClick={() => onSelect?.(order.id)}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'neutral.800'
                      : 'neutral.200',
                  borderRadius: 2,
                  maxWidth: 'fit-content',
                  ml: 3,
                  p: 1,
                }}
              >
                <Typography align="center" variant="subtitle2">
                  {createdAtMonth}
                </Typography>
                <Typography align="center" variant="h6">
                  {createdAtDay}
                </Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">
                Order Number: {order.orderNumber}
              </Typography>
            </TableCell>
            <TableCell>
              <SeverityPill color={statusColor}>
                {order.orderStatus}
              </SeverityPill>
            </TableCell>
            <TableCell>
              <Typography color="text.secondary" variant="body2">
                {totalAmount}
              </Typography>
            </TableCell>
            <TableCell>
              {order.orderStatus !== 'completed' ? (
                <>
                  <Button
                    disabled={
                      order.orderStatus === 'returned' && hasRole('basic')
                        ? false
                        : true
                    }
                    onClick={() => openModal(order)}
                  >
                    Edit
                  </Button>
                  <Modal
                    open={isModalOpen}
                    onClose={closeModal}
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
                          maxLength={9}
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
                          type="number"
                          label="Quantity"
                          placeholder="Quantity"
                          error={!!formEditErrors.quantity}
                          helperText={formEditErrors.quantity}
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
                    actions={
                      <Button onClick={() => handleSubmit()}>Submit</Button>
                    }
                  />
                </>
              ) : (
                <>
                  <Button
                    disabled={
                      order.orderStatus === 'completed' &&
                      hasRole('basic') &&
                      order.addedToInventory === false
                        ? false
                        : true
                    }
                    onClick={() => openAddModal(order)}
                  >
                    Add to Inventory
                  </Button>
                  <Modal
                    open={isAddOpen}
                    onClose={closeAddModal}
                    content={
                      <>
                        <Typography>
                          Was a QDR required for this item?
                        </Typography>
                      </>
                    }
                    actions={
                      <>
                        <Button onClick={() => handleQDR()}>Yes</Button>
                        <Button onClick={() => handleAddToInventory(order)}>
                          No
                        </Button>
                      </>
                    }
                  />
                </>
              )}
              <Button
                disabled={
                  order.orderStatus !== 'pending' &&
                  order.orderStatus !== 'returned' &&
                  hasRole('basic')
                    ? false
                    : true
                }
                onClick={() => openOrderModal(order)}
              >
                Order Again
              </Button>
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
                actions={
                  <Button onClick={() => handleOrderAgain()}>Submit</Button>
                }
              />
            </TableCell>
          </TableRow>
        )
      })}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message={msg}
        action={action}
      />
    </>
  )
}
