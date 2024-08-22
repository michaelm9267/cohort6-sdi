import { Fragment, useCallback, useState, useEffect } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";

import { Scrollbar } from '../../../../template/src/components/scrollbar';

export const CartListTable = (props) => {
  const {
    count = 0,
    items = [],
    // onPageChange = () => { },
    // onRowsPerPageChange,
    // page = 0,
    // rowsPerPage = 0,
    // navigate,
    onSelect,
  } = props;
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleProductToggle = useCallback((productId) => {
    setCurrentProduct((prevProductId) => {
      if (prevProductId === productId) {
        return null;
      }

      return productId;
    });
  }, []);

  const handleProductClose = useCallback(() => {
    setCurrentProduct(null);
  }, []);

  const handleProductUpdate = useCallback(() => {
    setCurrentProduct(null);
    toast.success('Cart updated');
  }, []);

  const handleProductDelete = useCallback(() => {
    toast.error('Cart item cannot be deleted');
  }, []);

  // SelectAll function
  const [things, setThings] = useState();
  const [select, setSelect] = useState(false);

  useEffect(() => {
    setThings(items)
  }, [])

  const handleChange = useCallback((index, checked) => {
    if (select && !checked) {
      setSelect(false)
    }

    const itemRef = [...things]
    itemRef[index].selected = checked // things = undefined, ergo itemRef = undefined --> but why doesn't const [things, setThings] = useState(items)
    setThings([...itemRef])
    console.log(things);
  })

  const handleChangeAll = useCallback((checked) => {
    const itemRef = [...items]

    itemRef.forEach((_item, i) => {
      itemRef[i].selected = checked
    })

    setSelect(checked)
    setThings([...itemRef])
    console.log(things)
  })

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControlLabel
                  label={
                    <Box component="div" fontSize={15}>
                      Select All
                    </Box>
                  }
                  control={
                    <Checkbox
                      name="all"
                      size="small"
                      checked={select}
                      onChange={(_e, checked) => handleChangeAll(checked)}
                    />
                  }
                />
              </TableCell>
              <TableCell width="25%">Order No.</TableCell>
              <TableCell width="25%">Unit</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((product, i) => {
              const isCurrent = product.id === currentProduct;
              const price = numeral(product.price).format(`${product.currency}0,0.00`);

              return (
                <Fragment key={product.id}>
                  <TableRow
                    hover
                    key={product.id}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(isCurrent && {
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)',
                          },
                        }),
                      }}
                      width="25%"
                    >
                      <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                        sx={{ p: 2 }}
                      >
                        <Checkbox
                          size="small"
                          name={product}
                          // value={selectAll}
                          checked={product.selected}
                          onChange={(_e, checked) => handleChange(i, checked)}
                        />
                        <IconButton onClick={() => handleProductToggle(product.id)}>
                          <SvgIcon>{isCurrent ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
                        </IconButton>
                      </Stack>
                    </TableCell>
                    {/* Order number */}
                    <TableCell width="25%" sx={{
                      alignItems: 'center'
                    }}>
                      <Typography variant="subtitle2">{product.id}</Typography>
                    </TableCell>
                    {/* Unit */}
                    <TableCell width="25%">
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {product.quantity}, Barksdale AFB
                      </Typography>
                    </TableCell>
                    {/* Customer Name */}
                    <TableCell>{product.name}</TableCell>
                    {/* Deliver Address */}
                    <TableCell>{product.sku}</TableCell>
                    {/* Total Price */}
                    <TableCell align="right">{price}</TableCell>
                  </TableRow>
                  {/* Dropdown details */}
                  {isCurrent && (
                    <TableRow
                      sx={{ backgroundColor: "lightgrey" }}
                    >
                      {/* Skinny color bar that stretches on left side of accordion */}
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)',
                          },
                        }}
                      >
                        {/* Buttons for each item */}
                        {product.items.map((item) => {

                          return (
                            <>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={15}
                                >
                                  <TableCell style={{ borderBottom: "none" }}>{item.name}</TableCell>
                                  <TableCell style={{ borderBottom: "none" }}>Qty: {item.quantity}</TableCell>
                                  <TableCell style={{ borderBottom: "none" }}>CIIC: {item.ciic}</TableCell>
                                  <TableCell style={{ borderBottom: "none" }}>NSN: {item.nsn}</TableCell>
                                  <TableCell style={{ borderBottom: "none" }}>JCN: {item.jcn}</TableCell>
                                </Stack>
                                <Stack
                                  alignItems="center"
                                  direction="row"
                                  sx={{ p: 2 }}
                                  spacing={2}
                                >
                                  <Button
                                    onClick={() => onSelect?.(item.name)}
                                    variant="contained"
                                  >
                                    Details
                                  </Button>
                                  <Button
                                    onClick={handleProductDelete}
                                    color="error"
                                    variant="outlined"
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    onClick={handleProductUpdate}
                                    type="submit"
                                    variant="outlined"
                                  >
                                    Edit
                                  </Button>
                                </Stack>
                              </Stack>
                              <Divider />
                            </>
                          )
                        })}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </div>
  )
}

CartListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};