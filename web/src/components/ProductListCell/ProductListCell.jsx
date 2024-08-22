import { Fragment, useEffect } from 'react'

import { TablePagination } from '@mui/material'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import numeral from 'numeral'
import { useQuery } from '@redwoodjs/web'

export const QUERY = gql`
  query FindProductListQuery(
    $shopID: Int!
    $page: Int
    $rowsPerPage: Int
    $query: String
  ) {
    shopInventoryByShopId(
      shopID: $shopID
      page: $page
      rowsPerPage: $rowsPerPage
      query: $query
    ) {
      paginatedParts {
        id
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
        quantity
        maxQuantity
        shop {
          id
          name
          phone
          dodaac
          address
          city
          state
          zip
          orgCode
          shopCode
          owner
          users {
            id
            email
            firstName
            lastName
            rank
            shopID
            roles
          }
        }
        shopID
      }
      totalCount
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  shopInventoryByShopId,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  onSelect,
  updateParts,
}) => {
  useEffect(() => {
    updateParts(shopInventoryByShopId.paginatedParts)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopInventoryByShopId, page, rowsPerPage])

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="25%">Name</TableCell>
            <TableCell width="25%">Stock</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>NSN</TableCell>
            <TableCell>Part Number</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shopInventoryByShopId.paginatedParts.map((product) => {
            const price = numeral(product.part.unitPrice).format(`$0,0.00`)
            const quantityColor =
              parseFloat(product.quantity / product.maxQuantity) * 100 >= 10
                ? 'success'
                : 'error'

            return (
              <Fragment key={product.id}>
                <TableRow hover key={product.id}>
                  <TableCell width="25%">
                    <Typography>{product.part.nomenclature}</Typography>
                  </TableCell>
                  <TableCell width="25%">
                    <LinearProgress
                      value={product.quantity}
                      variant="determinate"
                      color={quantityColor}
                      sx={{
                        height: 8,
                        width: 36,
                      }}
                    />
                    <Typography color="text.secondary" variant="body2">
                      {product.quantity} of {product.maxQuantity} in stock
                    </Typography>
                  </TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell>{product.part.nsn}</TableCell>
                  <TableCell>{product.part.partNumber}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => onSelect?.(product.id)}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={shopInventoryByShopId.totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  )
}
