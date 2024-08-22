import { useEffect } from 'react'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import numeral from 'numeral'

import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

import { SeverityPill } from '../../../../template/src/components/severity-pill'

const statusMap = {
  completed: 'success',
  pending: 'info',
  canceled: 'error',
  returned: 'error',
  approved: 'info',
}

export const QUERY = gql`
  query statusFilter(
    $status: String
    $page: Int
    $rowsPerPage: Int
    $role: String
    $shopID: Int
    $query: String
    $sort: String
  ) {
    statusFilter(
      orderStatus: $status
      page: $page
      rowsPerPage: $rowsPerPage
      role: $role
      shopID: $shopID
      query: $query
      sort: $sort
    ) {
      paginatedOrders {
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
          users {
            id
          }
          dodaac
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
        conFad
        priority
        message
        jcn
        wuc
        toRef
        markFor
        conFad
        addedToInventory
      }
      totalCount
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div></div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  statusFilter,
  updateOrdersInStore,
  onPageChange,
  onRowsPerPageChange,
  onSelect,
  page,
  rowsPerPage,
}) => {
  const { hasRole } = useAuth()
  useEffect(() => {
    updateOrdersInStore(statusFilter.paginatedOrders)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page, rowsPerPage])

  return (
    <div>
      <Table>
        <TableBody>
          {statusFilter.paginatedOrders.map((order) => {
            const dateString = order.orderDate
            const date = Date.parse(dateString, "yyyy-MM-dd'T'HH:mm:ss'Z'")
            const createdAtMonth = format(date, 'LLL').toUpperCase()
            const createdAtDay = format(date, 'dd')
            const numberPrice = parseFloat(
              order.part.unitPrice.replace(/,/g, '')
            )
            const totalAmount = numeral(
              numberPrice * order.orderQuantity
            ).format(`($0,0)`)
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
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle2">
                      Order Number: {order.orderNumber}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Total of {totalAmount}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    Submitted By:{' '}
                    {order.user.rank +
                      ' ' +
                      order.user.firstName +
                      ' ' +
                      order.user.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  {hasRole('admin') || hasRole('transport') ? (
                    <Typography variant="subtitle2">
                      Shop :
                      <Link
                        to={routes.home({
                          order: order.shop.shopCode,
                          name: order.shop.name,
                          owner: order.shop.owner,
                        })}
                      >
                        {order.shop.name}
                      </Link>
                    </Typography>
                  ) : (
                    <Typography variant="subtitle2">
                      {order.shop.name}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Part Name: {order.part.nomenclature}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">NSN: {order.part.nsn}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">JCN: {order.jcn}</Typography>
                </TableCell>
                <TableCell align="right">
                  <SeverityPill color={statusColor}>
                    {order.orderStatus}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={statusFilter.totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  )
}
