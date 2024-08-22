import { TableHead } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query shops {
    shops {
      id
      name
      phone
      address
      owner
      shopCode
      users {
        id
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ shops }) => {

  const acceptableShops = shops.filter(shop => shop.name !== 'Transportation' && shop.name !== 'LRS');
  return (
    <Card>
      <CardHeader title="Units" subheader="list of units" sx={{ pb: 0 }} />

      <Divider />
      <Table sx={{ height: 'fit-content' }}>
        <TableHead>
          <TableRow>
            <TableCell variant="h6">Shop</TableCell>
            <TableCell variant="h6">NCOIC</TableCell>
            <TableCell variant="h6">Assigned Perssonel</TableCell>
            <TableCell variant="h6">Location</TableCell>
            <TableCell variant="h6">Phone Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {acceptableShops.map((units, index) => (
            <TableRow
              key={index}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell width={100}>
                <Box
                  sx={{
                    p: 1,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'neutral.800'
                        : 'neutral.100',
                    borderRadius: 2,
                    maxWidth: 'fit-content',
                  }}
                >
                  <Typography
                    align="center"
                    color="text.primary"
                    variant="caption"
                  >
                    {/* You can put some data here */}
                  </Typography>
                  <Typography
                    align="center"
                    color="text.primary"
                    variant="subtitle2"
                  >
                    <Link
                      to={routes.home({
                        order: units.shopCode,
                        name: units.name,
                        owner: units.owner,
                      })}
                    >
                      {units.name}
                    </Link>
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="subtitle2">{units.owner}</Typography>
                </div>
              </TableCell>
              <TableCell>{units.users.length}</TableCell>
              <TableCell width={180}>
                <Typography variant="subtitle2">{units.address}</Typography>
              </TableCell>
              <TableCell>{units.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
