import { useState, useEffect, Fragment } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import numeral from 'numeral'
import PropTypes from 'prop-types'

import { useMutation } from '@redwoodjs/web'

const MUTATION = gql`
  mutation updateShopinventory($id: Int!, $input: UpdateShopinventoryInput!) {
    updateShopinventory(id: $id, input: $input) {
      id
      quantity
      maxQuantity
    }
  }
`

const ProductEdit = (props) => {
  const { onCancel, product, onClose, closeEdit } = props
  const [msg, setMsg] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [maxQuantity, setMaxQuantity] = useState(0)
  const [updateShopinventory] = useMutation(MUTATION)

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
    closeEdit(false)
    onClose()
  }

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  )

  useEffect(() => {
    setQuantity(product.quantity)
    setMaxQuantity(product.maxQuantity)
  }, [product])

  const handleUpdate = async () => {
    const input = {
      quantity: parseInt(quantity),
      maxQuantity: parseInt(maxQuantity),
    }
    await updateShopinventory({
      variables: {
        id: product.id,
        input: input,
      },
    })
    setMsg('Item was updated successfully!')
    setOpenSnack(true)
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Typography variant="h6">Details</Typography>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            name="quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <TextField
            fullWidth
            type="number"
            label="Maximum Allowed"
            name="max quantity"
            value={maxQuantity}
            onChange={(event) => setMaxQuantity(event.target.value)}
          />
        </Stack>
        <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={2}>
          <Button
            color="primary"
            onClick={() => handleUpdate()}
            size="small"
            variant="contained"
          >
            Save changes
          </Button>
          <Button color="inherit" onClick={onCancel} size="small">
            Cancel
          </Button>
        </Stack>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message={msg}
        action={action}
      />
    </Stack>
  )
}

ProductEdit.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  product: PropTypes.object,
  onClose: PropTypes.func,
}

export default ProductEdit
