/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, Fragment } from 'react'
import { useTheme } from '@mui/material/styles'
import "web/src/styles/presentation.css"


import CloseIcon from '@mui/icons-material/Close'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Unstable_Grid2'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'

import { navigate, routes, useLocation } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const MUTATION = gql`
  mutation updateOrderAtForm($id: Int!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      texCode
      sd
      projectCode
      rdd
      dueOutDoc
      orderStatus
      conFad
      priority
    }
  }
`

const CREATE_NOTIFICATION = gql`
  mutation createNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
      userID
      orderID
      message
    }
  }
`

const QUERY_ADMIN = gql`
  query shopUsersAdmin {
    shopUsersAdmin {
      id
    }
  }
`
const QUERY_TRANSPORT = gql`
  query shopUsersTransport {
    shopUsersTransport {
      id
    }
  }
`

const OrderFormPage = () => {
  const [priority, setPriority] = useState('')
  const [tex, setTex] = useState('')
  const [act, setAct] = useState('')
  const [org, setOrg] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [conFad, setConFad] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [shop, setShop] = useState('')
  const [date, setDate] = useState('')
  const [sd, setSd] = useState('')
  const [project, setProject] = useState('')
  const [dmdCondition, setDmdCondition] = useState('')
  const [dueInDoc, setDueInDoc] = useState('')
  const [msg, setMsg] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const location = useLocation()
  const {
    loading: loadingAdmin,
    error: errorAdmin,
    data: dataAdmin,
  } = useQuery(QUERY_ADMIN)
  const {
    loading: loadingTransport,
    error: errorTransport,
    data: dataTransport,
  } = useQuery(QUERY_TRANSPORT)
  const queryParam = new URLSearchParams(location.search).get('query')
  const order = JSON.parse(decodeURIComponent(queryParam || '{}'))
  const [createNotification] = useMutation(CREATE_NOTIFICATION)
  const [updateOrder] = useMutation(MUTATION)
  const { currentUser } = useAuth()
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const [formErrors, setFormErrors] = useState({
    priority: '',
    tex: '',
    act: '',
    org: '',
    serialNumber: '',
    conFad: '',
    deliveryDate: '',
    shop: '',
    date: '',
    sd: '',
    project: '',
    dmdCondition: '',
    dueInDoc: '',
  })
  const approverString =
    currentUser.rank +
    ' ' +
    currentUser.firstName +
    ' ' +
    currentUser.lastName +
    ', ' +
    currentUser.shop.name
  const todayDate = new Date().toDateString()
  const submitterString =
    order.user.rank +
    ' ' +
    order.user.firstName +
    ' ' +
    order.user.lastName +
    ', ' +
    order.shop.name +
    ', ' +
    order.shop.phone
  const approverInfo =
    currentUser.roles === 'admin'
      ? currentUser.rank +
        ' ' +
        currentUser.firstName +
        ' ' +
        currentUser.lastName
      : ''

  let disabled
  if (order.orderStatus !== 'pending') {
    disabled = true
  } else {
    disabled = false
  }

  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  const handleTex = (event) => {
    setTex(event.target.value)
  }

  const handlePriority = (event) => {
    setPriority(event.target.value)
  }

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
    if (shouldNavigate) {
      navigate(routes.shopOrders())
    }
    setShouldNavigate(false)
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

  const handleSubmit = async () => {
    if (validateForm()) {
      const dueOutDoc = act + org + shop + date + serialNumber + dmdCondition
      const input = {
        orderStatus: 'approved',
        projectCode: project,
        texCode: tex !== null ? tex : null,
        sd: sd,
        rdd: deliveryDate,
        dueOutDoc: dueOutDoc,
        dueInDoc: dueInDoc,
        priority: priority,
        conFad: conFad,
      }
      const notificationsMessage = `order #${order.orderNumber} was stamped approved by ${approverInfo} on ${todayDate}`
      await updateOrder({ variables: { id: order.id, input: input } })
      order.shop.users.map((user) => {
        createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: order.id,
              message: notificationsMessage,
            },
          },
        })
      })
      dataAdmin.shopUsersAdmin.map((user) => {
        createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: order.id,
              message: notificationsMessage,
            },
          },
        })
      })
      dataTransport.shopUsersTransport.map((user) => {
        createNotification({
          variables: {
            input: {
              userID: user.id,
              orderID: order.id,
              message: notificationsMessage,
            },
          },
        })
      })
      setOpenSnack(true)
      setMsg(
        `Order# ${order.orderNumber} was approved successfully! You will be returned to the Orders page.`
      )
      setShouldNavigate(true)
    } else {
      setOpenSnack(true)
      setMsg('Form fields are incorrect. Please fix and try again')
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = useCallback(async () => {
    const dueOutDoc = act + org + shop + date + serialNumber + dmdCondition
    const input = {
      projectCode: project,
      texCode: tex !== null ? tex : null,
      sd: sd,
      rdd: deliveryDate,
      dueOutDoc: dueOutDoc,
      dueInDoc: dueInDoc,
      priority: priority,
      conFad: conFad,
      demandCode: dmdCondition,
    }
    await updateOrder({
      variables: { id: order.id, input: input },
    })
    setOpenSnack(true)
    setMsg('Your changes were saved successfully!')
  })

  const validateForm = () => {
    let isValid = true
    const errors = {}

    if (!priority) {
      isValid = false
      errors.priority = 'Priority is required'
    }

    if (!act || !act.trim()) {
      isValid = false
      errors.act = 'Act is required'
    }

    if (!org || !org.trim()) {
      isValid = false
      errors.org = 'Org is required'
    }

    if (!serialNumber || !serialNumber.trim()) {
      isValid = false
      errors.serialNumber = 'Serial Number is required'
    }

    if (!conFad || !conFad.trim()) {
      isValid = false
      errors.conFad = 'Con Fad is required'
    }

    if (!deliveryDate || !deliveryDate.trim()) {
      isValid = false
      errors.deliveryDate = 'Delivery Date is required'
    }

    if (!shop || !shop.trim()) {
      isValid = false
      errors.shop = 'Shop is required'
    }

    if (!date || !date.trim()) {
      isValid = false
      errors.date = 'Date is required'
    }

    if (!sd || !sd.trim()) {
      isValid = false
      errors.sd = 'Sd is required'
    }

    if (!project || !project.trim()) {
      isValid = false
      errors.project = 'Project is required'
    }

    if (!dmdCondition || !dmdCondition.trim()) {
      isValid = false
      errors.dmdCondition = 'DMD Condition is required'
    }

    if (!dueInDoc || !dueInDoc.trim()) {
      isValid = false
      errors.dueInDoc = 'Due In Document Number is required'
    }

    setFormErrors(errors)
    return isValid
  }

  useEffect(() => {
    if (order.dueOutDoc !== null) {
      setAct(order.dueOutDoc.slice(0, 1))
      setOrg(order.dueOutDoc.slice(1, 4))
      setSerialNumber(order.dueOutDoc.slice(10, 14))
      setShop(order.dueOutDoc.slice(4, 6))
      setDate(order.dueOutDoc.slice(6, 10))
    }
    if (order.conFad !== null) {
      setConFad(order.conFad)
    }
    if (order.priority !== null) {
      setPriority(order.priority)
    }
    if (order.rdd !== null) {
      setDeliveryDate(order.rdd)
    }
    if (order.sd !== null) {
      setSd(order.sd)
    }
    if (order.projectCode !== null) {
      setProject(order.projectCode)
    }
    if (order.demandCode !== null) {
      setDmdCondition(order.demandCode)
    }
    if (order.texCode !== null) {
      setTex(order.texCode)
    }
    if (order.dueInDoc !== null) {
      setDueInDoc(order.dueInDoc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateOrder])

  const handleExport = async () => {
    const formUrl = 'https://warehome.netlify.app/af2005%20test%20fillable.pdf'
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(formPdfBytes)

    const form = pdfDoc.getForm()

    const requesterName = form
      .getTextField('A INCHECKER NAME DATE TIN')
      .setText(submitterString)
    // eslint-disable-next-line no-unused-vars
    const requesterName_2 = form
      .getTextField('A INCHECKER NAME DATE TIN_2')
      .setText(submitterString)
    // eslint-disable-next-line no-unused-vars
    const requesterDate = form
      .getTextField('REQUEST TIME & DATE (ISU)')
      .setText(order.orderDate)
    const requesterDate_2 = form
      .getTextField('REQUEST TIME & DATE (ISU)_2')
      .setText(order.orderDate)
    const approverInfo = form
      .getTextField('B INSPECTOR NAMESTAMP DATE TIN')
      .setText(approverString + ', ' + todayDate)
    const approverInfo_2 = form
      .getTextField('B INSPECTOR NAMESTAMP DATE TIN_2')
      .setText(approverString + ', ' + todayDate)
    const nsnField = form
      .getTextField('8 9 10 11')
      .setText(order.part.nsn.slice(0, 3))
    const nsnField_2 = form
      .getTextField('8 9 10 11_2')
      .setText(order.part.nsn.slice(0, 3))
    const niinField = form
      .getTextField('12 13 14 15 16 17 18 19 20')
      .setText(order.part.nsn.slice(3, 12))
    const niinField_2 = form
      .getTextField('12 13 14 15 16 17 18 19 20_2')
      .setText(order.part.nsn.slice(3, 12))
    const addnField = form
      .getTextField('21 22')
      .setText(order.part.nsn.slice(12, 14))
    const addnField_2 = form
      .getTextField('21 22_2')
      .setText(order.part.nsn.slice(12, 14))
    const unitOfIssueField = form
      .getTextField('23 24')
      .setText(order.part.unitOfIssue)
    const unitOfIssueField_2 = form
      .getTextField('23 24_2')
      .setText(order.part.unitOfIssue)
    const quantityField = form
      .getTextField('25 26 27 28 29')
      .setText(order.orderQuantity.toString())
    const quantityField_2 = form
      .getTextField('25 26 27 28 29_2')
      .setText(order.orderQuantity.toString())
    const wucAndPriceField = form
      .getTextField('c')
      .setText(order.wuc + '\n$' + order.part.unitPrice)
    const wucAndPriceField_2 = form
      .getTextField('c_2')
      .setText(order.wuc + '\n$' + order.part.unitPrice)
    const actField = form.getTextField('30').setText(act)
    const actField_2 = form.getTextField('30_2').setText(act)
    const orgField = form.getTextField('31 32 33').setText(org)
    const orgField_2 = form.getTextField('31 32 33_2').setText(org)
    const shopField = form.getTextField('34 35').setText(shop)
    const shopField_2 = form.getTextField('34 35_2').setText(shop)
    const dateField = form.getTextField('36 37 38 39').setText(date)
    const dateField_2 = form.getTextField('36 37 38 39_2').setText(date)
    const serNoField = form.getTextField('40 41 42 43').setText(serialNumber)
    const serNoField_2 = form
      .getTextField('40 41 42 43_2')
      .setText(serialNumber)
    const dmdCondField = form.getTextField('44').setText(dmdCondition)
    const dmdCondField_2 = form.getTextField('44_2').setText(dmdCondition)
    const partNumberField = form
      .getTextField('Part Number')
      .setText(order.part.partNumber)
    const partNumberField_2 = form
      .getTextField('Part Number_2')
      .setText(order.part.partNumber)
    const partNumberRemarksField = form
      .getTextField('PART NUMBER')
      .setText(order.part.partNumber)
    const partNumberRemarksField_2 = form
      .getTextField('PART NUMBER_2')
      .setText(order.part.partNumber)
    const toRefField = form.getTextField('TO REF').setText(order.toRef)
    const toRefField_2 = form.getTextField('TO REF_2').setText(order.toRef)
    const shipToField = form
      .getTextField('45 46 47 48 49 50')
      .setText(order.shop.dodaac)
    const shipToField_2 = form
      .getTextField('45 46 47 48 49 50_2')
      .setText(order.shop.dodaac)
    const texField = form.getTextField('51').setText(tex !== null ? tex : '')
    const texField_2 = form
      .getTextField('51_2')
      .setText(tex !== null ? tex : '')
    const conFadField = form.getTextField('52 53').setText(conFad.slice(0, 2))
    const conFadField_2 = form
      .getTextField('52 53_2')
      .setText(conFad.slice(0, 2))
    const conFadTwoField = form.getTextField('54').setText(conFad.slice(2, 3))
    const conFadTwoField_2 = form
      .getTextField('54_2')
      .setText(conFad.slice(2, 3))
    const sdField = form.getTextField('55 56').setText(sd)
    const sdField_2 = form.getTextField('55 56_2').setText(sd)
    const projectField = form.getTextField('57 58 59').setText(project)
    const projectField_2 = form.getTextField('57 58 59_2').setText(project)
    const priorityField = form
      .getTextField('60 61')
      .setText(priority.toString())
    const priorityField_2 = form
      .getTextField('60 61_2')
      .setText(priority.toString())
    const reqDelDateField = form.getTextField('62 63 64').setText(order.rdd)
    const reqDelDateField_2 = form.getTextField('62 63 64_2').setText(order.rdd)
    const ujcField = form
      .getTextField('65 66')
      .setText(order.ujc === null ? '' : order.ujc)
    const ujcField_2 = form
      .getTextField('65 66_2')
      .setText(order.ujc === null ? '' : order.ujc)
    const jcnField = form.getTextField('JCN').setText(order.jcn)
    const jcnField_2 = form.getTextField('JCN_2').setText(order.jcn)
    const markForField = form.getTextField('MARK FOR').setText(order.markFor)
    const markForField_2 = form
      .getTextField('MARK FOR_2')
      .setText(order.markFor)
    const timeAndDateOfDeliveryField = form
      .getTextField('G TIME  DATE OF DELIVERY')
      .setText('')
    const timeAndDateOfDeliveryField_2 = form
      .getTextField('G TIME  DATE OF DELIVERY_2')
      .setText('')
    const deliveryTimeField = form.getTextField('H DELIVERY TIME').setText('')
    const deliveryTimeField_2 = form
      .getTextField('H DELIVERY TIME_2')
      .setText('')
    const nomenclatureField = form
      .getTextField('J NOMENCLATURE')
      .setText(order.part.nomenclature)
    const nomenclatureField_2 = form
      .getTextField('J NOMENCLATURE_2')
      .setText(order.part.nomenclature)

    const pdfBytes = await pdfDoc.save()
    saveAs(
      new Blob([pdfBytes], { type: 'application/pdf' }),
      `${order.markFor}_${order.part.nomenclature}.pdf`
    )
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            direction: 'row',
            justifyContent: 'space-between',
          }}
        >
          <h1 className={liClassName}
          style={{fontFamily: "sans-serif"}}
          
          >2005 Form</h1>
          {order.orderStatus === 'pending' ? (
            <Box
              sx={{
                mt: 2,
              }}
            >
              <Button
                sx={{
                  marginRight: 2,
                }}
                onClick={handleSave}
                type="submit"
                variant="contained"
              >
                Save To Draft
              </Button>
              <Button type="submit" variant="contained" onClick={handleSubmit}>
                Save & Submit
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" onClick={handleExport}>
                Export to PDF
              </Button>
            </Box>
          )}
        </Box>
        <h3 className={liClassName}
        style={{fontFamily: "sans-serif"}}
        >Auto Generated:</h3>
        <form onSubmit={(event) => event.preventDefault()}>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                label="Register name, shop and contact"
                name="name"
                required
                value={submitterString}
                disabled={true}
              
              />
            </Grid>
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                label="Approvers name, shop and date"
                name="email"
                required
                value={approverString + ', ' + todayDate}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                label="T.O./Figure Number/Item Number"
                name="toRef"
                required
                value={order.toRef}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                label="Part Number"
                name="partNumber"
                value={order.part.partNumber}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                value={'$' + order.part.unitPrice}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="Work Unit Code"
                name="wuc"
                value={order.wuc}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="T.O. PSC AND/OR ERRC"
                name="markFor"
                value={order.markFor}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                label="Nomenclature"
                name="name"
                value={order.part.nomenclature}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                value={order.orderQuantity}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="PN/MGFR Code or name/remarks"
                name="nameOrRemarks"
                value={order.part.partNumber}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="Work Order Ships To"
                name="shipsTo"
                value={order.shop.dodaac}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="JCN"
                name="jcn"
                value={order.jcn}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="Time & date of Delivery"
                name="delieveryTime"
                value=""
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <TextField
                fullWidth
                label="Unit of Issue"
                name="unitOfIssue"
                value={order.part.unitOfIssue.toUpperCase()}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                label="Request, Time & Date (ISU)"
                name="requestTimeDate"
                value={order.orderDate}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={1}>
              <TextField
                fullWidth
                label="NSN"
                name="nsn"
                value={order.part.nsn.slice(0, 4)}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <TextField
                fullWidth
                label="NIIN"
                name="niin"
                value={order.part.nsn.slice(4, 13)}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="ADDN"
                name="addn"
                value={order.part.nsn.slice(13)}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                label="UJC"
                name="ujc"
                value={order.ujc}
                disabled={true}
              />
            </Grid>
            <Grid xs={12} md={12}>
              <h3 className={liClassName}
              style={{fontFamily: "sans-serif"}}
              >Please Fill Out:</h3>
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 1 }}
                label="ACT"
                name="act"
                value={act}
                error={!!formErrors.act}
                helperText={formErrors.act}
                onChange={(event) => setAct(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 3 }}
                label="ORG"
                name="org"
                value={org}
                error={!!formErrors.org}
                helperText={formErrors.org}
                onChange={(event) => setOrg(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 4 }}
                label="SER NO."
                name="serialNumber"
                value={serialNumber}
                error={!!formErrors.serialNumber}
                helperText={formErrors.serialNumber}
                onChange={(event) => setSerialNumber(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 3 }}
                label="CON/FAD"
                name="conFad"
                value={conFad}
                error={!!formErrors.conFad}
                helperText={formErrors.conFad}
                onChange={(event) => setConFad(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="priorityLabel">Priority</InputLabel>
                <Select
                  labelId="priorityLabel"
                  label="Priority"
                  value={priority}
                  error={!!formErrors.priority}
                  onChange={handlePriority}
                  disabled={disabled}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={11}>11</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={13}>13</MenuItem>
                  <MenuItem value={14}>14</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
                {formErrors.priority && (
                  <Typography variant="caption" color="error">
                    {formErrors.priority}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 3 }}
                label="Requested Delivery Date"
                name="rdt"
                value={deliveryDate}
                error={!!formErrors.deliveryDate}
                helperText={formErrors.deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 2 }}
                label="Shop"
                name="shop"
                value={shop}
                error={!!formErrors.shop}
                helperText={formErrors.shop}
                onChange={(event) => setShop(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 4 }}
                label="Date"
                name="date"
                value={date}
                error={!!formErrors.date}
                helperText={formErrors.date}
                onChange={(event) => setDate(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="texLabel">TEX</InputLabel>
                <Select
                  labelId="texLabel"
                  label="TEX"
                  value={tex}
                  onChange={handleTex}
                  disabled={disabled}
                >
                  <MenuItem value={'I'}>I</MenuItem>
                  <MenuItem value={'Q'}>Q</MenuItem>
                  <MenuItem value={'U'}>U</MenuItem>
                </Select>
                {formErrors.tex && (
                  <Typography variant="caption" color="error">
                    {formErrors.tex}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 2 }}
                label="SD"
                name="sd"
                value={sd}
                error={!!formErrors.sd}
                helperText={formErrors.sd}
                onChange={(event) => setSd(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 3 }}
                label="Project"
                name="project"
                value={project}
                error={!!formErrors.project}
                helperText={formErrors.project}
                onChange={(event) => setProject(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 1 }}
                label="DMD Condition"
                name="dmdCondition"
                value={dmdCondition}
                error={!!formErrors.dmdCondition}
                helperText={formErrors.dmdCondition}
                onChange={(event) => setDmdCondition(event.target.value)}
                disabled={disabled}
              />
            </Grid>
            <Grid xs={12} md={2}>
              <TextField
                fullWidth
                inputProps={{ maxLength: 16 }}
                label="Due-In Document Number"
                name="dueInDocumentNumber"
                value={dueInDoc}
                error={!!formErrors.dueInDoc}
                helperText={formErrors.dueInDoc}
                onChange={(event) => setDueInDoc(event.target.value)}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message={msg}
          action={action}
        />
      </Box>
    </>
  )
}

export default OrderFormPage
