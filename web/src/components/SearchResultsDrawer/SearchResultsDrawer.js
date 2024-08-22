import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useMutation } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import Modal from '../Modal/Modal'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { translate } from 'pdf-lib'
import { TextField, Grid, Stack } from '@mui/material'

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

function SearchResultsDrawer({ isOpen, selectedItem, setIsOpen }) {
  const [openModal, setOpenModal] = useState(false)
  const { currentUser } = useAuth()
  const [jcn, setJcn] = useState('')
  const [toRef, setToRef] = useState('')
  const [ujc, setUjc] = useState('')
  const [markFor, setMarkFor] = useState('')
  const [wuc, setWuc] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [createOrder] = useMutation(MUTATION)
  const [formErrors, setFormErrors] = useState({
    jcn: '',
    toRef: '',
    ujc: '',
    markFor: '',
    wuc: '',
    quantity: '',
  })
  const onClose = () => {
    setIsOpen(!isOpen)
  }

  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)

  const handleAddToCart = async () => {
    if (validateAddToCart()) {
      const input = {
        jcn: jcn,
        toRef: toRef,
        ujc: ujc,
        markFor: markFor,
        wuc: wuc,
        orderQuantity: parseInt(quantity),
        shopID: currentUser.shopID,
        partId: selectedItem.id,
        userID: currentUser.id,
      }
      console.log(selectedItem)
      await createOrder({ variables: { input: input } })
      alert('Your order was successfully added to your cart!')
      setOpenModal(false)
    } else {
      alert('Form fields are incorrect. Please fix and try again')
    }
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
    <Container
      sx={{
        borderLeft: '1px solid #EEE',
        borderBottom: '1px solid #EEE',
        width: 'fitContent',
        margin: '0px',
        transition: '10s ease',
        height: '75%',
        overflowY: 'scroll',
      }}
    >
      <Box>
        <IconButton
          color="black"
          onClick={onClose}
          style={{ margin: '5px 5px 30px 425px'}}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ position: 'sticky', top: '0', zIndex: '1', }}
         bgcolor={(theme) => theme.palette.mode === "dark" ? "black" : "#fff"}
         >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{
              mb: '30px',
              
            }}
          >
            <Box>
              <Typography
                variant="h6"
                color={(theme) =>
                  theme.palette.mode === 'dark' ? 'white' : 'black'
                }
              >
                Details
              </Typography>
            </Box>
            {currentUser.roles === 'basic' ? (
              <Stack>
                <Button size="small" variant="contained" onClick={handleOpen}>
                  Add to Cart
                </Button>
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  content={
                    <>
                      <TextField
                        disableUnderline
                        fullWidth
                        placeholder="JCN"
                        error={!!formErrors.jcn}
                        helperText={formErrors.jcn}
                        sx={{
                          marginBottom: 1,
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
                        }}
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                      />
                    </>
                  }
                  actions={
                    <Button onClick={handleAddToCart}>Add To Cart</Button>
                  }
                />
              </Stack>
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <List>
          {selectedItem &&
            Object.entries(selectedItem).map(([label, value]) => {
              const formattedLabel = label
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              return label !== '__typename' && label !== 'id' ? (
                <React.Fragment key={label}>
                  <ListItem
                    sx={{
                      margin: '10px 0 10px none',
                      padding: '5px 0',
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? 'white' : 'black',
                    }}
                  >
                    <ListItemText
                      primary={
                        label.length <= 4 ? label.toUpperCase() : formattedLabel
                      }
                      secondary={value}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ) : null
            })}
        </List>
      </Box>
    </Container>
  )
}

export default SearchResultsDrawer
