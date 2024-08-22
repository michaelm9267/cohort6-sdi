import { useState, useCallback, useEffect } from 'react'

import { SvgIcon, TableBody } from '@mui/material'
import {
  Card,
  CardHeader,
  Tabs,
  Tab,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { ArrowRight } from '@untitled-ui/icons-react'

import { Link, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import HomePageOrdersCell from 'src/components/HomePageOrdersCell/HomePageOrdersCell'
import ShopMap from 'src/components/ShopMap/ShopMap'
import ShopOrderHomePageCell from 'src/components/ShopOrderHomePageCell/ShopOrderHomePageCell'
import ShopStaticsCell from 'src/components/ShopStatisticsCell/ShopStatisticsCell'
import ShopUserCell from 'src/components/ShopUserCell/ShopUserCell'

import { Seo } from '../../../../template/src/components/seo'

const tabOptions = [
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

const HomePage = ({ order, name, owner }) => {
  const { currentUser, hasRole } = useAuth()
  const [currentTab, setCurrentTab] = useState('all')
  const [status, setStatus] = useState()
  const [page, setPage] = useState(0)
  let shopID
  let shopName
  let ncoic
  if (hasRole('basic')) {
    shopID = currentUser.shopID
    shopName = currentUser.shop.name
    ncoic = currentUser.shop.owner
  } else {
    shopID = parseInt(order)
    shopName = name
    ncoic = owner
  }

  useEffect(() => {
    if ((hasRole('admin') || hasRole('transport')) && order === undefined) {
      navigate(routes.listOfUnits())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRole])

  const handleTabsChange = useCallback((event, tab) => {
    setCurrentTab(tab)
    const status = tab === 'all' ? undefined : tab
    setStatus(status)
  }, [])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  return (
    <>
      <Seo title="Dashboard: Logistics Dashboard" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <div>
                  <Typography
                    variant="h4"
                    color={(theme) =>
                      theme.palette.mode === 'dark' ? 'white' : 'black'
                    }
                  >
                    {shopName} Home Page
                  </Typography>
                  <Typography
                    variant="h6"
                    color={(theme) =>
                      theme.palette.mode === 'dark' ? 'white' : 'black'
                    }
                  >
                    NCOIC: {ncoic}
                  </Typography>
                </div>
                {hasRole('transport') ? (
                  <></>
                ) : (
                  <Link to={routes.shopInventory({ shopID: shopID })}>
                    <Button>
                      Go To Inventory
                      <SvgIcon>
                        <ArrowRight />
                      </SvgIcon>
                    </Button>
                  </Link>
                )}
              </Stack>
            </Grid>
            <Grid xs={12} md={2}>
              <HomePageOrdersCell shopID={shopID} orderStatus={'completed'} />
            </Grid>
            <Grid xs={12} md={2}>
              <HomePageOrdersCell shopID={shopID} orderStatus={'approved'} />
            </Grid>
            <Grid xs={12} md={2}>
              <HomePageOrdersCell shopID={shopID} orderStatus={'pending'} />
            </Grid>
            <Grid xs={12} md={2}>
              <HomePageOrdersCell shopID={shopID} orderStatus={'returned'} />
            </Grid>
            <Grid xs={12} md={2}>
              <HomePageOrdersCell shopID={shopID} orderStatus={'in transit'} />
            </Grid>
            <Grid xs={12} md={2}>
              <HomePageOrdersCell
                shopID={shopID}
                orderStatus={'awaiting pickup'}
              />
            </Grid>
            {/* <Grid xs={12}>
              <ShopMap />
            </Grid> */}
            <Grid xs={12} lg={6}>
              <ShopStaticsCell shopID={shopID} />
            </Grid>
            <Grid xs={6}>
              <ShopUserCell
                shopID={shopID}
                page={page}
                onPageChange={handlePageChange}
              />
            </Grid>
            <Grid xs={12}>
              <Card sx={{ height: 690 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <CardHeader
                    title="Latest 5 Transactions"
                    subheader="Based on the selected status"
                    sx={{ pb: 0 }}
                  />
                  <Link to={routes.shopOrders()}>
                    <Button sx={{ marginRight: 5, gap: 1 }}>
                      Go To Orders
                      <SvgIcon>
                        <ArrowRight />
                      </SvgIcon>
                    </Button>
                  </Link>
                </Box>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  textColor="primary"
                  value={currentTab || 'all'}
                  scrollButtons="auto"
                >
                  {tabOptions.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                <Divider />
                <Table sx={{ height: 'fit-content' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <ShopOrderHomePageCell
                      shopID={shopID}
                      orderStatus={status}
                    />
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default HomePage
