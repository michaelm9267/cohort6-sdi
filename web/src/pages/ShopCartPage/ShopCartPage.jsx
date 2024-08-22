import { useCallback, useEffect, useState, useRef, useMemo } from 'react'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useAuth } from 'src/auth'
import { CartListContainer } from 'src/components/CartListContainer/CartListContainer'

import { useDialog } from '../../../../template/src/hooks/use-dialog'
import CartCell from '../../components/CartCell'
import CartDrawer from '../../components/CartDrawer/CartDrawer'

// handles which orders are currently displayed
const useOrdersStore = () => {
  const [state, setState] = useState({
    orders: [],
    ordersCount: 0,
  })

  const updateOrders = (newOrders) => {
    // deletes entries in cart cell
    console.log('deletion step 4 / 8 (cart page)')
    setState({
      orders: newOrders,
      ordersCount: newOrders.length,
    })
  }

  useEffect(() => {
    setState({
      orders: state.orders,
      ordersCount: state.orders.length,
    })
  }, [])

  return {
    ...state,
    updateOrders,
  }
}

// filters specific order
const useCurrentOrder = (orders, orderId) => {
  return useMemo(() => {
    if (!orderId) {
      return undefined
    }
    return orders.find((order) => order.orderNumber === orderId)
  }, [orders, orderId])
}

const ShopCartPage = () => {
  const rootRef = useRef(null)
  const ordersStore = useOrdersStore()
  const dialog = useDialog()
  const currentOrder = useCurrentOrder(ordersStore.orders, dialog.data)
  const { currentUser } = useAuth()

  const updateOrdersInStore = (draftsOnly) => {
    console.log('deletion step 3 / 7 (cart page)')
    ordersStore.updateOrders(draftsOnly)
  }

  const handleSubmit = (deleted) => {
    if (deleted) {
      console.log('deletion step 2 (cart page)')
      const remainingOrders = ordersStore.orders.filter((order) => order.id !== currentOrder.id)
      updateOrdersInStore(remainingOrders)
    }
    dialog.handleClose()
  }

  const handleOrderOpen = useCallback(
    (orderId) => {
      // Close drawer if is the same order
      if (dialog.open && dialog.data === orderId) {
        dialog.handleClose()
        return
      }
      dialog.handleOpen(orderId)
    },
    [dialog]
  )

  return (
    <>
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }}
        m={2}
      >
        <Container maxWidth="xl">
          <CartListContainer open={dialog.open}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <div>
                  <Typography variant="h4" color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}>Cart</Typography>
                </div>
              </Stack>
              <CartCell
                shopID={currentUser.shopID}
                role={currentUser.roles}
                updateOrdersInStore={updateOrdersInStore}
                onSelect={handleOrderOpen}
                orders={ordersStore.orders} // triggers cell re-render on deletion
              />
            </Stack>
          </CartListContainer>
        </Container>
        <CartDrawer
          container={rootRef.current}
          onClose={dialog.handleClose}
          open={dialog.open}
          order={currentOrder}
          onSubmit={handleSubmit}
        />
      </Box>
    </>
  )
}

export default ShopCartPage
