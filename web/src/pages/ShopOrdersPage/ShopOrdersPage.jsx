import { useCallback, useMemo, useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd'

import { navigate } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { OrderDrawer } from 'src/components/OrderDrawer/OrderDrawer'
import { OrderListContainer } from 'src/components/OrderListContainer/OrderListContainer'
import OrdersCell from 'src/components/OrdersCell/OrdersCell'

import { Seo } from '../../../../template/src/components/seo'
import { useDialog } from '../../../../template/src/hooks/use-dialog'

const tabOptions = () => {
  const { hasRole } = useAuth()
  return hasRole('admin') || hasRole('basic')
    ? [
        {
          label: 'All',
          value: 'all',
        },
        {
          label: 'Canceled',
          value: 'canceled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Returned',
          value: 'returned',
        },
        {
          label: 'Awaiting Pickup',
          value: 'awaiting pickup',
        },
        {
          label: 'In Transit',
          value: 'in transit',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
      ]
    : [
        {
          label: 'All',
          value: 'all',
        },
        {
          label: 'Canceled',
          value: 'canceled',
        },
        {
          label: 'Awaiting Pickup',
          value: 'awaiting pickup',
        },
        {
          label: 'In Transit',
          value: 'in transit',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ]
}

const sortOptions = [
  {
    label: 'Newest',
    value: 'desc',
  },
  {
    label: 'Oldest',
    value: 'asc',
  },
]

const useCurrentOrder = (orders, orderId) => {
  return useMemo(() => {
    if (!orderId) {
      return undefined
    }

    return orders.find((order) => order.id === orderId)
  }, [orders, orderId])
}

const ShopOrdersPage = () => {
  const [status, setStatus] = useState()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('desc')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const rootRef = useRef(null)
  const dialog = useDialog()
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState({
    orders: [],
    ordersLength: 0,
  })
  const [query, setQuery] = useState()
  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState('all')
  const [search, setSearch] = useState('')
  const navigateToOrdersForm = (order) => {
    const orderString = encodeURIComponent(JSON.stringify(order))
    navigate(`/order-form?query=${orderString}`)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    dialog.handleClose()
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleTabsChange = useCallback((event, tab) => {
    setCurrentTab(tab)
    const status = tab === 'all' ? undefined : tab

    setStatus(status)
    setPage(0)
    dialog.handleClose()
  }, [])

  const updateOrdersInStore = (statusFilter) => {
    setOrders({
      orders: statusFilter,
      ordersLength: statusFilter.length,
    })
  }

  const currentOrder = useCurrentOrder(orders.orders, dialog.data)

  const updateQuery = useCallback(
    (event) => {
      event.preventDefault()
      setQuery(search)
    },
    [search]
  )

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
      <Seo title="Dashboard: Order List" />
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <OrderListContainer open={dialog.open}>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography
                    variant="h4"
                    color={(theme) =>
                      theme.palette.mode === 'dark' ? 'white' : 'black'
                    }
                  >
                    Orders
                  </Typography>
                </div>
              </Stack>
            </Box>
            <Divider />
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                sx={{ px: 3 }}
                textColor="primary"
                value={status || 'all'}
                variant="scrollable"
              >
                {tabOptions().map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
              <Divider />
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={3}
                sx={{ p: 3 }}
              >
                <Box
                  component="form"
                  onSubmit={updateQuery}
                  sx={{ flexGrow: 1 }}
                >
                  <OutlinedInput
                    defaultValue=""
                    fullWidth
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    name="orderNumber"
                    placeholder="Search by order number"
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgIcon>
                          <SearchMdIcon />
                        </SvgIcon>
                      </InputAdornment>
                    }
                  />
                </Box>
                <TextField
                  label="Sort By"
                  name="sort"
                  select
                  SelectProps={{ native: true }}
                  onChange={(event) => setSort(event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Stack>
            </div>
            <Divider />
            <OrdersCell
              sort={sort}
              query={query}
              shopID={currentUser.shopID}
              role={currentUser.roles}
              status={status}
              updateOrdersInStore={updateOrdersInStore}
              count={orders.ordersLength}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelect={handleOrderOpen}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </OrderListContainer>
        </Container>
        <OrderDrawer
          container={rootRef.current}
          onClose={dialog.handleClose}
          open={dialog.open}
          order={currentOrder}
          onApprove={navigateToOrdersForm}
        />
      </Box>
    </>
  )
}

export default ShopOrdersPage
