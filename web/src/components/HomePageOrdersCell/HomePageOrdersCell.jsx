import { Approval } from '@mui/icons-material'
import { MapsHomeWork } from '@mui/icons-material'
import { Check } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { AlertCircle } from '@untitled-ui/icons-react'
import { Truck01 } from '@untitled-ui/icons-react'
import AlertTriangleIcon from '@untitled-ui/icons-react/build/esm/AlertTriangle'

export const QUERY = gql`
  query shopStatusFilter($shopID: Int, $orderStatus: String) {
    shopStatusFilter(shopID: $shopID, orderStatus: $orderStatus) {
      count
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ shopStatusFilter, orderStatus }) => {
  let statusIcon
  let text
  let backgroundColor

  switch (orderStatus) {
    case 'approved':
      statusIcon = <Approval />
      text = 'Approved Orders'
      backgroundColor = 'lightgreen'
      break
    case 'pending':
      statusIcon = <AlertCircle />
      text = 'Pending Orders'
      backgroundColor = 'orange'
      break
    case 'returned':
      statusIcon = <AlertTriangleIcon />
      text = 'Returned Orders'
      backgroundColor = 'red'
      break
    case 'completed':
      statusIcon = <Check />
      text = 'Completed Orders'
      backgroundColor = 'green'
      break
    case 'awaiting pickup':
      statusIcon = <MapsHomeWork />
      text = 'Orders Awaiting Pickup'
      backgroundColor = 'purple'
      break
    case 'in transit':
      statusIcon = <Truck01 />
      text = 'Orders in Transit'
      backgroundColor = 'blue'
      break
  }

  return (
    <Card>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Avatar
            variant="rounded"
            sx={{
              backgroundColor: { backgroundColor },
              color: 'white',
            }}
          >
            <SvgIcon>{statusIcon}</SvgIcon>
          </Avatar>
          {shopStatusFilter.count !== null ? (
            <Typography variant="h5">{shopStatusFilter.count}</Typography>
          ) : (
            <Typography variant="h5">0</Typography>
          )}
        </Stack>
        <Typography color="text.secondary" variant="body2">
          {text}
        </Typography>
      </Stack>
    </Card>
  )
}
