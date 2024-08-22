import { useDialog } from '../../../../template/src/hooks/use-dialog'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import ProductDrawer from 'src/components/ProductDrawer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { useEffect, useRef, useState, useCallback } from 'react'
import Button from '@mui/material/Button'

export const QUERY = gql`
  query SearchQuery($term: String, $limit: Int) {
    searchQuery(term: $term, limit: $limit) {
    id
    nomenclature
    nsn
    partNumber
    unitOfIssue
    unitPrice
    typeCargoCode
    shelfLifeCode
    rid
    isg
    cageCode
    commodityCode
    hazardousMaterialCode
    nmfc
    location
    manufacturer
    description
  }
}
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ searchQuery, limit, onOpenDrawer, isOpen, setSelectedItem, selectedItem}) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };


  const handleClick = (item) => {
    setSelectedItem(item);
    onOpenDrawer(item);
  };




  return (
    <div>
      <Box>
        <Stack sx={{ border: "transparent solid 25px", height: "75vh" }}
        >
          <Table sx={{ maxWidth: 'auto', minWidth: '850px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Nomenclature</TableCell>
              <TableCell>NSN</TableCell>
              <TableCell>Part Number</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {(rowsPerPage > 0
              ? searchQuery.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : 
              searchQuery).map((item) => (
                <TableRow key={item.id}>
                  <TableCell width="20%">{item.nomenclature.toUpperCase()}</TableCell>
                  <TableCell width="20%">{item.nsn}</TableCell>
                  <TableCell width="20%">{item.partNumber}</TableCell>
                  <TableCell width="20%">{item.unitPrice}</TableCell>
                  <TableCell width="20%" align="left">
                    <Button onClick={() => handleClick(item)}>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
              <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'ALL', value: -1}]}
              count={searchQuery.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableBody>
          </Table>
        </Stack>
      </Box>
    </div>
  );
};
