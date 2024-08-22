import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const CartEdit = (props) => {
  const { onCancel, onSave, order } = props;

  const [fillables, setFillables] = useState({
    orderQuantity: order.orderQuantity,
    ujc: order.ujc,
    dodaac: order.dodaac
  });

  const handleChange = (event) => {
    setFillables(prevState => {
      if (event.target.name === "quantity") {
        return {
          ...prevState,
          orderQuantity: parseInt(event.target.value)
        }
      } else if (event.target.name === "ujc") {
        return {
          ...prevState,
          ujc: event.target.value
        }
      } else {
        return {
          ...prevState,
          dodaac: event.target.value
        }
      }
    })
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack spacing={3}>
          <TextField
            disabled
            fullWidth
            label="Customer"
            name="customer"
            value={order.user.rank + ' ' + order.user.firstName + ' ' + order.user.lastName}
          />
          <TextField
            fullWidth
            label="DODAAC"
            name="dodaac"
            defaultValue={fillables.dodaac}
            onChange={handleChange}
          />
          <TextField
            disabled
            fullWidth
            name="nomenclature"
            label="Nomenclature"
            value={order.part.nomenclature}
          />
          <TextField
            disabled
            fullWidth
            name="nsn"
            label="NSN"
            value={order.part.nsn}
          />
          <TextField
            disabled
            fullWidth
            name="partNumber"
            label="Part Number"
            value={order.part.partNumber}
          />
          <TextField
            disabled
            fullWidth
            name="cageCode"
            label="Cage Code"
            value={order.part.cageCode}
          />
          <TextField
            disabled
            fullWidth
            name="uoi"
            label="Unit of Issue"
            value={order.part.unitOfIssue}
          />
          <TextField
            fullWidth
            name="quantity"
            label="Quantity"
            defaultValue={fillables.orderQuantity}
            onChange={handleChange}
            type="number"
          />
          <TextField
            disabled
            fullWidth
            name="unitPrice"
            label="Unit Price"
            value={order.part.unitPrice}
          />
          <TextField
            fullWidth
            name="ujc"
            label="UJC"
            defaultValue={fillables.ujc}
            onChange={handleChange}
          />
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          spacing={2}
        >
          <Button
            color="primary"
            onClick={() => onSave(fillables)}
            size="small"
            variant="contained"
          >
            Save changes
          </Button>
          <Button
            color="inherit"
            onClick={onCancel}
            size="small"
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

CartEdit.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  order: PropTypes.object,
};

export default CartEdit
