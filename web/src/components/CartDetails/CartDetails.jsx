import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { PropertyList } from '../../components/PropertyList'
import { PropertyListItem } from '../../components/PropertyListItem'

const CartDetails = (props) => {
  const { onSubmit, onEdit, onReject, order } = props;
  const align = 'vertical';
  const dateString = order.orderDate
  const date = parseFloat(dateString, "yyyy-MM-dd'T'HH:mm:ss'Z'")
  const createdAt = format(date, 'yyyy-dd-MM HH:mm');

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={2}
        >
          <Button
            color="inherit"
            onClick={onEdit}
            size="small"
            startIcon={
              <SvgIcon>
                <Edit02Icon />
              </SvgIcon>
            }
          >
            Edit
          </Button>
        </Stack>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Customer"
          >
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {order.user.rank + ' ' + order.user.firstName + ' ' + order.user.lastName}
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {order.shop.address}
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              {order.shop.city + ', ' + order.shop.state + ', ' + order.shop.zip}
            </Typography>
          </PropertyListItem>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Nomenclature"
            value={order.part.nomenclature}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="NSN"
            value={order.part.nsn}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Part Number"
            value={order.part.partNumber}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Date"
            value={createdAt}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Cage Code"
            value={order.part.cageCode}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Unit of Issue"
            value={order.part.unitOfIssue}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Quantity"
            value={order.orderQuantity.toString()}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Unit Price"
            value={order.part.unitPrice}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="ISG"
            value={order.part.isg}
          />
        </PropertyList>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          justifyContent="flex-end"
          spacing={2}
        >
          <Button
            onClick={onSubmit}
            size="small"
            variant="contained"
          >
            Submit
          </Button>
          <Button
            color="error"
            onClick={onReject}
            size="small"
            variant="outlined"
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

CartDetails.propTypes = {
  onSubmit: PropTypes.func,
  onEdit: PropTypes.func,
  onReject: PropTypes.func,
  order: PropTypes.object,
};

export default CartDetails
