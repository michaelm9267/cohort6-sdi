import * as React from 'react'

import { Card, CardHeader } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'

export const QUERY = gql`
  query shopOrders($shopID: Int!) {
    shopOrders(shopID: $shopID) {
      id
      orderStatus
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ shopOrders }) => {
  const completed = shopOrders.filter(
    (order) => order.orderStatus === 'completed'
  ).length
  const pending = shopOrders.filter(
    (order) => order.orderStatus === 'pending'
  ).length
  const inTransit = shopOrders.filter(
    (order) => order.orderStatus === 'in transit'
  ).length
  const returned = shopOrders.filter(
    (order) => order.orderStatus === 'returned'
  ).length
  const approved = shopOrders.filter(
    (order) => order.orderStatus === 'approved'
  ).length
  const awaitingPickup = shopOrders.filter(
    (order) => order.orderStatus === 'awaiting pickup'
  ).length
  const data = [
    { id: 0, value: completed, label: 'Completed' },
    { id: 1, value: pending, label: 'Pending' },
    { id: 2, value: inTransit, label: 'In Transit' },
    { id: 3, value: returned, label: 'Returned' },
    { id: 4, value: approved, label: 'Approved' },
    { id: 5, value: awaitingPickup, label: 'Awaiting Pickup' },
  ]
  return (
    <Card sx={{ height: 550 }}>
      <CardHeader
        title="Order Statistics"
        subheader="Statistics for orders belonging to this shop"
      />
      <PieChart
        sx={{ display: 'flex' }}
        series={[
          {
            data,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={400}
        width={700}
      />
    </Card>
  )
}
