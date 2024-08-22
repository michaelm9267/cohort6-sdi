import { useCallback, useMemo, useRef, useState, Fragment } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Input } from '@mui/material'
import { Container, Divider, Grid, TextField, Typography } from '@mui/material'
import { Chip } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus'
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd'

import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Modal from 'src/components/Modal/Modal'
import ProductListCell from 'src/components/ProductListCell/ProductListCell'
import ProductListContainer from 'src/components/ProductListContainer/ProductListContainer'

import { Seo } from '../../../../template/src/components/seo'
import { useDialog } from '../../../../template/src/hooks/use-dialog'
import ProductDrawer from '../../components/ProductDrawer'

const QUERY_PARTS = gql`
  query parts {
    parts {
      id
      status
      submittingShop
    }
  }
`
const MUTATION = gql`
  mutation createPart($input: CreatePartInput!) {
    createPart(input: $input) {
      id
      nomenclature
    }
  }
`

const DELETE_ITEM = gql`
  mutation deleteShopinventory($id: Int!) {
    deleteShopinventory(id: $id) {
      id
    }
  }
`

const useCurrentProduct = (products, productId) => {
  return useMemo(() => {
    if (!productId) {
      return undefined
    }

    return products.find((product) => product.id === productId)
  }, [products, productId])
}

const ShopInventoryPage = ({ shopID }) => {
  const { data, refetch } = useQuery(QUERY_PARTS)
  const [nomenclature, setNomenclature] = useState('')
  const [nsn, setNsn] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [cageCode, setCageCode] = useState('')
  const [unitOfIssue, setUnitOfIssue] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [isg, setIsg] = useState('')
  const [commodityCode, setCommodityCode] = useState('')
  const [shelfLifeCode, setShelfLifeCode] = useState('')
  const [typeCargoCode, setTypeCargoCode] = useState('')
  const [hazardousMaterialCode, setHazardousMaterialCode] = useState('')
  const [rid, setRid] = useState('')
  const [nmfc, setNmfc] = useState('')
  const [description, setDescription] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [msg, setMsg] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [parts, setParts] = useState({
    parts: [],
    partsLength: 0,
  })
  const { currentUser } = useAuth()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [createPart] = useMutation(MUTATION, {
    onCompleted: () => {
      refetch()
    },
  })
  const rootRef = useRef(null)
  const dialog = useDialog()
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [formErrors, setFormErrors] = useState({
    nomenclature: '',
    nsn: '',
    partNumber: '',
    cageCode: '',
    unitOfIssue: '',
    unitPrice: '',
    isg: '',
    commodityCode: '',
    shelfLifeCode: '',
    typeCargoCode: '',
    hazardousMaterialCode: '',
    rid: '',
    nmfc: '',
    description: '',
    manufacturer: '',
  })
  const currentProduct = useCurrentProduct(parts.parts, dialog.data)
  const [deleteItem] = useMutation(DELETE_ITEM)
  let currentShop
  if (currentUser.roles !== 'admin') {
    currentShop = currentUser.shopID
  } else {
    currentShop = parseInt(shopID)
  }
  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setFormErrors({
      nomenclature: '',
      nsn: '',
      partNumber: '',
      cageCode: '',
      unitOfIssue: '',
      unitPrice: '',
      isg: '',
      commodityCode: '',
      shelfLifeCode: '',
      typeCargoCode: '',
      hazardousMaterialCode: '',
      rid: '',
      nmfc: '',
      description: '',
      manufacturer: '',
    })
  }

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

  const handleProductOpen = useCallback(
    (productId) => {
      // Close drawer if is the same order

      if (dialog.open && dialog.data === productId) {
        dialog.handleClose()
        return
      }

      dialog.handleOpen(productId)
    },
    [dialog]
  )

  const pendingPartsByShop = data
    ? data.parts.filter(
        (item) =>
          item.submittingShop === currentUser.shopID && item.status === 'parts'
      ).length
    : 'loading'

  const handleDelete = async (product) => {
    let newParts = parts.parts.filter((part) => part.id !== product.id)
    await deleteItem({ variables: { id: product.id } })
    setOpenSnack(true)
    setMsg(`${product.part.nomenclature} has been deleted!`)
    dialog.handleClose()
    updateParts(newParts)
  }

  const handleAddPart = async () => {
    if (validateAddPart()) {
      const input = {
        nomenclature: nomenclature,
        nsn: nsn,
        partNumber: partNumber,
        cageCode: cageCode,
        unitOfIssue: unitOfIssue,
        unitPrice: unitPrice,
        isg: isg,
        commodityCode: commodityCode,
        shelfLifeCode: shelfLifeCode,
        typeCargoCode: typeCargoCode,
        hazardousMaterialCode: hazardousMaterialCode,
        rid: rid,
        nmfc: nmfc,
        description: description,
        manufacturer: manufacturer,
        submittingShop: currentUser.shopID,
      }
      await createPart({ variables: { input: input } })
      setOpenSnack(true)
      setMsg(`${nomenclature} was submitted for approval successfully!`)
      setIsAddModalOpen(false)
    }
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    dialog.handleClose()
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const updateQuery = useCallback(
    (event) => {
      event.preventDefault()
      setQuery(search)
    },
    [search]
  )

  const updateParts = (statusFilter) => {
    setParts({
      parts: statusFilter,
      partsLength: statusFilter.length,
    })
  }

  const validateAddPart = () => {
    let isValid = true
    const errors = {}

    if (!nomenclature || !nomenclature.trim()) {
      isValid = false
      errors.nomenclature = 'Nomenclature is required'
    }

    if (!nsn || !nsn.trim()) {
      isValid = false
      errors.nsn = 'NSN is required'
    }

    if (!partNumber || !partNumber.trim()) {
      isValid = false
      errors.partNumber = 'Part Number is required'
    }

    if (!cageCode || !cageCode.trim()) {
      isValid = false
      errors.cageCode = 'Cage Code is required'
    }

    if (!unitOfIssue || !unitOfIssue.trim()) {
      isValid = false
      errors.unitOfIssue = 'Unit of Issue is required'
    }

    if (!unitPrice || !unitPrice.trim()) {
      isValid = false
      errors.unitPrice = 'Unit Price is required'
    } else if (unitPrice.includes('$')) {
      isValid = false
      errors.unitPrice = 'Please only input numbers without currency symbols'
    }

    if (!isg || !isg.trim()) {
      isValid = false
      errors.isg = 'ISG is required'
    }

    if (!commodityCode || !commodityCode.trim()) {
      isValid = false
      errors.commodityCode = 'Commodity Code is required'
    }

    if (!shelfLifeCode || !shelfLifeCode.trim()) {
      isValid = false
      errors.shelfLifeCode = 'Shelf Life Code is required'
    }

    if (!typeCargoCode || !typeCargoCode.trim()) {
      isValid = false
      errors.typeCargoCode = 'Type Cargo Code is required'
    }

    if (!hazardousMaterialCode || !hazardousMaterialCode.trim()) {
      isValid = false
      errors.hazardousMaterialCode = 'Hazardous Material Code is required'
    }

    if (!rid || !rid.trim()) {
      isValid = false
      errors.rid = 'RID is required'
    }

    if (!nmfc || !nmfc.trim()) {
      isValid = false
      errors.nmfc = 'NMFC is required'
    }

    if (!description || !description.trim()) {
      isValid = false
      errors.description = 'Description is required'
    }

    if (!manufacturer || !manufacturer.trim()) {
      isValid = false
      errors.manufacturer = 'Manufacturer is required'
    }

    setFormErrors(errors)
    return isValid
  }

  return (
    <>
      <Seo title="Dashboard: Product List" />
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <ProductListContainer open={dialog.open}>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="flex"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography
                    variant="h4"
                    color={(theme) =>
                      theme.palette.mode === 'dark' ? 'white' : 'black'
                    }
                  >
                    Inventory
                  </Typography>
                </div>
                {currentUser.roles === 'basic' ? (
                  <div>
                    <Button
                      onClick={openAddModal}
                      startIcon={
                        <SvgIcon>
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                    >
                      Add
                    </Button>
                    <Modal
                      open={isAddModalOpen}
                      onClose={closeAddModal}
                      content={
                        <>
                          <Grid container>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Nomenclature"
                                error={!!formErrors.nomenclature}
                                helperText={formErrors.nomenclature}
                                required
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={nomenclature}
                                onChange={(event) =>
                                  setNomenclature(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="NSN"
                                error={!!formErrors.nsn}
                                helperText={formErrors.nsn}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={nsn}
                                onChange={(event) => setNsn(event.target.value)}
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Part Number"
                                error={!!formErrors.partNumber}
                                helperText={formErrors.partNumber}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={partNumber}
                                onChange={(event) =>
                                  setPartNumber(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Cage Code"
                                error={!!formErrors.cageCode}
                                helperText={formErrors.cageCode}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={cageCode}
                                onChange={(event) =>
                                  setCageCode(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Unit of Issue"
                                error={!!formErrors.unitOfIssue}
                                helperText={formErrors.unitOfIssue}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={unitOfIssue}
                                onChange={(event) =>
                                  setUnitOfIssue(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Unit Price"
                                error={!!formErrors.unitPrice}
                                helperText={formErrors.unitPrice}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={unitPrice}
                                onChange={(event) =>
                                  setUnitPrice(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="ISG (NSN Substitute)"
                                error={!!formErrors.isg}
                                helperText={formErrors.isg}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={isg}
                                onChange={(event) => setIsg(event.target.value)}
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Commodity Code"
                                error={!!formErrors.commodityCode}
                                helperText={formErrors.commodityCode}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={commodityCode}
                                onChange={(event) =>
                                  setCommodityCode(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Shelf Life Code"
                                error={!!formErrors.shelfLifeCode}
                                helperText={formErrors.shelfLifeCode}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={shelfLifeCode}
                                onChange={(event) =>
                                  setShelfLifeCode(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Type Cargo Code"
                                error={!!formErrors.typeCargoCode}
                                helperText={formErrors.typeCargoCode}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={typeCargoCode}
                                onChange={(event) =>
                                  setTypeCargoCode(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Hazardous Material Code"
                                error={!!formErrors.hazardousMaterialCode}
                                helperText={formErrors.hazardousMaterialCode}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={hazardousMaterialCode}
                                onChange={(event) =>
                                  setHazardousMaterialCode(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Routing Identifier Code"
                                error={!!formErrors.rid}
                                helperText={formErrors.rid}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={rid}
                                onChange={(event) => setRid(event.target.value)}
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="National Motor Freight Classification"
                                error={!!formErrors.nmfc}
                                helperText={formErrors.nmfc}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={nmfc}
                                onChange={(event) =>
                                  setNmfc(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Description"
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={description}
                                onChange={(event) =>
                                  setDescription(event.target.value)
                                }
                              />
                            </Grid>
                            <Grid xs={12} md={5.5} margin={1}>
                              <TextField
                                fullWidth
                                placeholder="Manufacturer"
                                error={!!formErrors.manufacturer}
                                helperText={formErrors.manufacturer}
                                sx={{
                                  input: {
                                    color: 'black',
                                  },
                                }}
                                value={manufacturer}
                                onChange={(event) =>
                                  setManufacturer(event.target.value)
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      }
                      actions={
                        <Button onClick={() => handleAddPart()}>Submit</Button>
                      }
                    />
                  </div>
                ) : (
                  <></>
                )}
              </Stack>
            </Box>
            <Divider />
            <Stack direction="row" spacing={2} sx={{ p: 2 }}>
              <Chip
                label={`Number of Parts Pending Approval: ${pendingPartsByShop}`}
              />
            </Stack>
            <Stack
              alignItems="center"
              component="form"
              direction="row"
              onSubmit={updateQuery}
              spacing={2}
              sx={{ p: 2 }}
            >
              <SvgIcon
                sx={{
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? 'white' : 'black',
                }}
              >
                <SearchMdIcon />
              </SvgIcon>
              <Input
                defaultValue=""
                disableUnderline
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for item in inventory"
                sx={{ flexGrow: 1 }}
              />
            </Stack>
            <ProductListCell
              query={query}
              shopID={currentShop}
              updateParts={updateParts}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              count={parts.partsLength}
              rowsPerPage={rowsPerPage}
              onSelect={handleProductOpen}
            />
          </ProductListContainer>
        </Container>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message={msg}
          action={action}
        />
        <ProductDrawer
          onDelete={handleDelete}
          container={rootRef.current}
          onClose={dialog.handleClose}
          open={dialog.open}
          product={currentProduct}
        />
      </Box>
    </>
  )
}

export default ShopInventoryPage
