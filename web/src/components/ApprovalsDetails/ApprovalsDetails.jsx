import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PropertyList } from '../../components/PropertyList'
import { PropertyListItem } from '../../components/PropertyListItem'

const ApprovalsDetails = (props) => {
  const { onSubmit, onReject, approval } = props;
  const align = 'vertical';
  // const dateString = order.orderDate
  // const date = parseFloat(dateString, "yyyy-MM-dd'T'HH:mm:ss'Z'")
  // const createdAt = format(date, 'yyyy-dd-MM HH:mm');

  const handleDetails = () => {
    // console.log("approvals below")
    // console.log(approval)
    if (approval.status === "users") {
      // print user details
      return <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Request Date & Time"
          value={approval.created}
        />
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
            {approval.rank + ' ' + approval.firstName + ' ' + approval.lastName}
          </Typography>
        </PropertyListItem>
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Shop Name & Address"
        >
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {approval.shop.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {approval.shop.address}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {approval.shop.city + ', ' + approval.shop.state + ', ' + approval.shop.zip}
          </Typography>
        </PropertyListItem>
      </PropertyList>
    } else {
      // print part details
      return <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Nomenclature"
          value={approval.nomenclature}
        />
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="NSN"
          value={approval.nsn}
        />
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Part Number"
          value={approval.partNumber}
        />
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Cage Code"
          value={approval.cageCode}
        />
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Unit of Issue"
          value={approval.unitOfIssue}
        />
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="Unit Price"
          value={approval.unitPrice}
        />
        <PropertyListItem
          align={align}
          disableGutters
          divider
          label="ISG"
          value={approval.isg}
        />
      </PropertyList>
    }
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        {handleDetails()}
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
            Approve
          </Button>
          <Button
            color="error"
            onClick={onReject}
            size="small"
            variant="outlined"
          >
            Deny
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

ApprovalsDetails.propTypes = {
  onSubmit: PropTypes.func,
  onReject: PropTypes.func,
  approval: PropTypes.object,
};

export default ApprovalsDetails
