import { useState, Fragment } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02'
import numeral from 'numeral'
import PropTypes from 'prop-types'

import { useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import { PropertyList } from '../../components/PropertyList'
import { PropertyListItem } from '../../components/PropertyListItem'
import Modal from '../Modal/Modal'

const MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      shopID
      userID
      partId
      orderQuantity
      ujc
      jcn
      shipTo
      wuc
      toRef
    }
  }
`

const ProductDetails = (props) => {
  const { onEdit, product, onDelete } = props
  const { currentUser } = useAuth()
  const [isModalOpen, setModalOpen] = useState(false)
  const [jcn, setJcn] = useState('')
  const [toRef, setToRef] = useState('')
  const [ujc, setUjc] = useState('')
  const [markFor, setMarkFor] = useState('')
  const { hasRole } = useAuth()
  const [wuc, setWuc] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [createOrder] = useMutation(MUTATION)
  const [openSnack, setOpenSnack] = useState(false)
  const [msg, setMsg] = useState('')
  const [formErrors, setFormErrors] = useState({
    jcn: '',
    toRef: '',
    ujc: '',
    markFor: '',
    wuc: '',
    quantity: '',
  })

  const align = 'vertical'
  const price = numeral(product.part.unitPrice).format(`$0,0.00`)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
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

  const handleAddToCart = async () => {
    if (validateAddToCart()) {
      const input = {
        jcn: jcn,
        toRef: toRef,
        ujc: ujc,
        markFor: markFor,
        wuc: wuc,
        orderQuantity: parseInt(quantity),
        shopID: product.shopID,
        partId: product.partId,
        userID: currentUser.id,
      }
      await createOrder({ variables: { input: input } })
      setOpenSnack(true)
      setMsg('Your order was successfully added to your cart!')
      setModalOpen(false)
    }
  }

  const handleDelete = async () => {
    onDelete(product)
  }

  const validateAddToCart = () => {
    let isValid = true
    const errors = {}

    if (!jcn || !jcn.trim()) {
      isValid = false
      errors.jcn = 'JCN is required'
    }

    if (!toRef || !toRef.trim()) {
      isValid = false
      errors.toRef = 'T.O. Reference is required'
    }

    if (!markFor || !markFor.trim()) {
      isValid = false
      errors.markFor = 'Site/Aircraft/Benchstock is required'
    }

    if (!wuc || !wuc.trim()) {
      isValid = false
      errors.wuc = 'Work Unit Code is required'
    }

    if (quantity === 0) {
      isValid = false
      errors.quantity = 'Quantity must be greater than 0'
    }

    setFormErrors(errors)
    return isValid
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Typography variant="h6">Details</Typography>
          {hasRole('basic') ? (
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
          ) : (
            <></>
          )}
        </Stack>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="ID"
            value={product.id}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Name"
            value={product.part.nomenclature}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="NSN"
            value={product.part.nsn}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Hazardous Material Code"
            value={product.part.hazardousMaterialCode}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Price"
            value={price}
          />
          <PropertyListItem
            align={align}
            disableGutters
            divider
            label="Quantity in Stock"
            value={product.quantity}
          />
        </PropertyList>
        {currentUser.roles === 'basic' ? (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button onClick={openModal} size="small" variant="contained">
              Add to Cart
            </Button>
            <Modal
              open={isModalOpen}
              onClose={closeModal}
              content={
                <>
                  <TextField
                    disableUnderline
                    fullWidth
                    inputProps={{ maxLength: 9 }}
                    placeholder="JCN"
                    error={!!formErrors.jcn}
                    helperText={formErrors.jcn}
                    sx={{
                      marginBottom: 1,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={jcn}
                    onChange={(event) => setJcn(event.target.value)}
                  />
                  <TextField
                    disableUnderline
                    fullWidth
                    placeholder="Site/Aircraft/Benchstock"
                    error={!!formErrors.markFor}
                    helperText={formErrors.markFor}
                    sx={{
                      marginBottom: 1,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={markFor}
                    onChange={(event) => setMarkFor(event.target.value)}
                  />
                  <TextField
                    disableUnderline
                    fullWidth
                    placeholder="Technical Order Reference"
                    error={!!formErrors.toRef}
                    helperText={formErrors.toRef}
                    sx={{
                      marginBottom: 1,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={toRef}
                    onChange={(event) => setToRef(event.target.value)}
                  />
                  <TextField
                    disableUnderline
                    fullWidth
                    placeholder="Work Unit Code"
                    error={!!formErrors.wuc}
                    helperText={formErrors.wuc}
                    sx={{
                      marginBottom: 1,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={wuc}
                    onChange={(event) => setWuc(event.target.value)}
                  />
                  <TextField
                    disableUnderline
                    fullWidth
                    placeholder="UJC (If item is MICAP)"
                    sx={{
                      marginBottom: 1,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={ujc}
                    onChange={(event) => setUjc(event.target.value)}
                  />
                  <TextField
                    fullWidth
                    placeholder="Quantity"
                    error={!!formErrors.quantity}
                    helperText={formErrors.quantity}
                    type="number"
                    min={0}
                    sx={{
                      marginBottom: 1,
                      input: {
                        color: 'black',
                      },
                    }}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </>
              }
              actions={<Button onClick={handleAddToCart}>Add To Cart</Button>}
            />
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </Stack>
        ) : (
          <></>
        )}
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

ProductDetails.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  product: PropTypes.object,
}

export default ProductDetails
