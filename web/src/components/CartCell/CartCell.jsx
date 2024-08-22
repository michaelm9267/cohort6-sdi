import numeral from 'numeral';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import TableHead from '@mui/material/TableHead';

export const QUERY = gql`
  query draftFilter($role: String, $shopID: Int) {
    draftFilter(role: $role, shopID: $shopID){
      id
      orderNumber
      orderDate
      orderStatus
      shop{
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
        dodaac
        users{
          id
        }
      }
      shopID
      user {
        id
        email
        firstName
        lastName
        rank
        shopID
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
      conFad
      wuc
      priority
    }
  }
`

export const Loading = () => <Typography variant="h6" color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}>Loading...</Typography>

export const Empty = () => <Typography variant="h3" color={(theme) => theme.palette.mode === 'dark' ? 'grey' : 'grey'} sx={{textAlign: "center"}}>Cart is Empty</Typography>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ draftFilter, updateOrdersInStore, onSelect, orders }) => {
  // is only being called when editing existing records, but not on deletion?????
  useEffect(() => {
    console.log("deletion step 6 (cart cell)")
    console.log(draftsOnly)
    updateOrdersInStore(draftsOnly);
  }, [draftFilter])

  var draftsOnly = []
  draftsOnly = draftFilter.filter((order) => order.orderStatus === "draft") // triggers useEffect
  console.log("deletion step 5 (cart cell)")
  console.log(draftsOnly)

  if (draftsOnly.length === 0) {
    return <Typography variant="h6" color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}>Cart is Empty</Typography>
  }

  return (
    <div>
      <Table sx={{ minWidth: 1200 }}>
        <TableHead>
          <TableCell>Order</TableCell>
          <TableCell>Customer Name</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Unit Address</TableCell>
        </TableHead>
        <TableBody>
          {draftsOnly.map((order) => {
            if (order.orderStatus === 'draft') {
              const numberPrice = parseFloat(order.part.unitPrice.replace(/,/g, ''))
              const totalAmount = numeral(numberPrice * order.orderQuantity).format(
                `($0,0)`
              )
              const unit = order.shop.name;
              const customerName = order.user.rank + ' ' + order.user.lastName + ', ' + order.user.firstName;
              const address = order.shop.address;

              return (
                <TableRow
                  hover
                  key={order.id}
                  onClick={() => onSelect?.(order.orderNumber)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">Order Number: {order.orderNumber}</Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        Total of {totalAmount}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customerName}</TableCell>
                  <TableCell>{unit}</TableCell>
                  <TableCell>{address}</TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </div>
  )
}
