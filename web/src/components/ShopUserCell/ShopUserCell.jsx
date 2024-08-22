import { useState, Fragment, useEffect } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  SvgIcon,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TablePagination,
} from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Plus } from '@untitled-ui/icons-react'

import { useMutation, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import Modal from '../Modal/Modal'

export const QUERY = gql`
  query FindShopUserQuery($shopID: Int!, $page: Int) {
    shopUsers(shopID: $shopID, page: $page) {
      paginatedUsers {
        id
        email
        firstName
        lastName
        rank
        shop {
          name
        }
        shopID
        status
      }
      totalCount
    }
  }
`

const MUTATION = gql`
  mutation updateUserAtHome($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      rank
      shopID
    }
  }
`
const DELETE = gql`
  mutation deleteUserAtHome($id: Int!) {
    deleteUser(id: $id) {
      id
      email
      firstName
      lastName
    }
  }
`

const CREATE = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ shopUsers, shopID, page, onPageChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rank, setRank] = useState('')
  const [shop, setShop] = useState('')
  const [updateUser] = useMutation(MUTATION)
  const [addEmail, setAddEmail] = useState('')
  const { hasRole } = useAuth()
  const [addFirstName, setAddFirstName] = useState('')
  const [addLastName, setAddLastName] = useState('')
  const [addRank, setAddRank] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [openSnack, setOpenSnack] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    rank: '',
  })
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
  }
  const [updateErrors, setUpdateErrors] = useState({ email: '' })
  const [createUser] = useMutation(CREATE, {
    onCompleted: () => {
      refetch()
    },
  })
  const { refetch } = useQuery(QUERY, {
    variables: { shopID: shopID, page: page },
  })
  const [deleteUser] = useMutation(DELETE, {
    onCompleted: () => {
      refetch()
    },
  })
  const [selectedUser, setSelectedUser] = useState({})
  const [deletedUser, setDeletedUser] = useState({})

  const openModal = (user) => {
    setIsModalOpen(true)
    setSelectedUser(user)
  }
  const closeModal = () => setIsModalOpen(false)

  const openDeleteModal = (user) => {
    setIsDeleteModalOpen(true)
    setDeletedUser(user)
  }
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleRank = (event) => {
    setRank(event.target.value)
  }
  const handleShop = (event) => {
    setShop(event.target.value)
  }

  const handleAddRank = (event) => {
    setAddRank(event.target.value)
  }

  useEffect(() => {
    if(isModalOpen){
      setEmail(selectedUser.email)
      setFirstName(selectedUser.firstName)
      setLastName(selectedUser.lastName)
      setRank(selectedUser.rank)
      setShop(selectedUser.shopID)
    }
  }, [isModalOpen])

  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => setIsAddModalOpen(false)

  const validateForm = () => {
    let isValid = true
    const errors = {}

    if (!addEmail || !addEmail.trim()) {
      isValid = false
      errors.email = 'Email is required'
    } else if (!isValidEmail(addEmail)) {
      isValid = false
      errors.email = 'Invalid email format'
    }

    if (!addPassword || !addPassword.trim()) {
      isValid = false
      errors.password = 'Password is required'
    }

    if (!addFirstName || !addFirstName.trim()) {
      isValid = false
      errors.firstName = 'First name is required'
    }

    if (!addLastName || !addLastName.trim()) {
      isValid = false
      errors.lastName = 'Last name is required'
    }

    if (!addRank || !addRank.trim()) {
      isValid = false
      errors.rank = 'Rank is required'
    }

    setFormErrors(errors)
    return isValid
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

  const validateUpdate = () => {
    let isValid = true
    let errors = {}

    if (email === '') {
      isValid = true
    } else if (!isValidEmail(email)) {
      isValid = false
      errors.email = 'Invalid email format'
    }

    setUpdateErrors(errors)
    return isValid
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleAddUser = async () => {
    let errors = {}
    if (validateForm()) {
      const input = {
        email: addEmail,
        hashedPassword: addPassword,
        firstName: addFirstName,
        lastName: addLastName,
        rank: addRank,
        shopID: shopID,
      }
      try {
        await createUser({ variables: { input: input } })
        setOpenSnack(true)
        setMsg('User was successfully added!')
        setIsAddModalOpen(false)
      } catch (error) {
        errors.email = 'Email already exists'
        setFormErrors(errors)
      }
    }
  }

  const handleDeleteUser = async () => {
    await deleteUser({ variables: { id: deletedUser.id } })
    setOpenSnack(true)
    setMsg('User successfully deleted!')
    setIsDeleteModalOpen(false)
  }

  const handleUpdateUser = async () => {
    if (validateUpdate()) {
      const input = {
        email: email !== '' ? email : selectedUser.email,
        firstName: firstName !== '' ? firstName : selectedUser.firstName,
        lastName: lastName !== '' ? lastName : selectedUser.lastName,
        rank: rank !== '' ? rank : selectedUser.rank,
        shopID: shop !== '' ? shop : parseInt(selectedUser.shopID),
      }
      await updateUser({
        variables: { id: selectedUser.id, input: input },
      })
      setOpenSnack(true)
      setMsg('User successfully updated!')
      setIsModalOpen(false)
      setEmail('')
      setFirstName('')
      setLastName('')
      setRank('')
      setShop('')
    } else {
      setOpenSnack(true)
      setMsg('Form fields are incorrect. Please fix and try again')
    }
  }

  return (
    <Card sx={{ height: 550 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CardHeader
          title="User Table"
          subheader="List of all users belonging to shop"
        />
        {!hasRole('transport') ? (
          <Button
            sx={{ marginRight: 2, gap: 1 }}
            variant="contained"
            onClick={openAddModal}
          >
            Add New User
            <SvgIcon>
              <Plus />
            </SvgIcon>
          </Button>
        ) : (
          <></>
        )}
        <Modal
          open={isAddModalOpen}
          onClose={closeAddModal}
          content={
            <>
              <TextField
                fullWidth
                label="Email"
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={{
                  marginBottom: 1,
                  input: {
                    color: 'black',
                  },
                }}
                value={addEmail}
                onChange={(event) => setAddEmail(event.target.value)}
              />
              <TextField
                fullWidth
                error={!!formErrors.password}
                helperText={formErrors.password}
                label="Password"
                type="password"
                sx={{
                  marginBottom: 1,
                  input: {
                    color: 'black',
                  },
                }}
                value={addPassword}
                onChange={(event) => setAddPassword(event.target.value)}
              />
              <TextField
                fullWidth
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                label="First Name"
                sx={{
                  marginBottom: 1,
                  input: {
                    color: 'black',
                  },
                }}
                value={addFirstName}
                onChange={(event) => setAddFirstName(event.target.value)}
              />
              <TextField
                fullWidth
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                label="Last Name"
                sx={{
                  marginBottom: 1,
                  input: {
                    color: 'black',
                  },
                }}
                value={addLastName}
                onChange={(event) => setAddLastName(event.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="rankLabel">Rank</InputLabel>
                <Select
                  fullWidth
                  error={!!formErrors.rank}
                  labelId="rankLabel"
                  label="Rank"
                  value={addRank}
                  onChange={handleAddRank}
                  sx={{ color: 'black' }}
                >
                  <MenuItem value={'AB'}>AB</MenuItem>
                  <MenuItem value={'Amn'}>Amn</MenuItem>
                  <MenuItem value={'A1C'}>A1C</MenuItem>
                  <MenuItem value={'SrA'}>SrA</MenuItem>
                  <MenuItem value={'SSgt'}>SSgt</MenuItem>
                  <MenuItem value={'TSgt'}>TSgt</MenuItem>
                  <MenuItem value={'MSgt'}>MSgt</MenuItem>
                  <MenuItem value={'2Lt'}>2Lt</MenuItem>
                  <MenuItem value={'1Lt'}>1Lt</MenuItem>
                  <MenuItem value={'Capt'}>Capt</MenuItem>
                </Select>
                {formErrors.rank && (
                  <Typography variant="caption" color="error">
                    {formErrors.rank}
                  </Typography>
                )}
              </FormControl>
            </>
          }
          actions={
            <Button type="submit" onClick={() => handleAddUser()}>
              Submit
            </Button>
          }
        />
      </Box>
      <Box sx={{ maxWidth: 'xl' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopUsers.paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="subtitle2">{user.rank}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.firstName + ' ' + user.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.status === 'users' ? 'Pending' : 'Approved'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => openModal(user)}
                    disabled={hasRole('transport') ? true : false}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => openDeleteModal(user)}
                    disabled={hasRole('transport') ? true : false}
                  >
                    Delete
                  </Button>
                </TableCell>
                <Modal
                  open={isModalOpen}
                  onClose={closeModal}
                  content={
                    <>
                      <TextField
                        fullWidth
                        label="Email"
                        error={!!updateErrors.email}
                        helperText={updateErrors.email}
                        sx={{
                          marginBottom: 1,
                          input: {
                            color: 'black',
                          },
                        }}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="First Name"
                        sx={{
                          marginBottom: 1,
                          input: {
                            color: 'black',
                          },
                        }}
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                      />
                      <TextField
                        fullWidth
                        label="Last Name"
                        sx={{
                          marginBottom: 1,
                          input: {
                            color: 'black',
                          },
                        }}
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="rankLabel">Rank</InputLabel>
                        <Select
                          labelId="rankLabel"
                          label="Rank"
                          value={rank}
                          onChange={handleRank}
                          sx={{
                            marginBottom: 1,
                            color: 'black',
                          }}
                        >
                          <MenuItem value={'AB'}>AB</MenuItem>
                          <MenuItem value={'Amn'}>Amn</MenuItem>
                          <MenuItem value={'A1C'}>A1C</MenuItem>
                          <MenuItem value={'SrA'}>SrA</MenuItem>
                          <MenuItem value={'SSgt'}>SSgt</MenuItem>
                          <MenuItem value={'TSgt'}>TSgt</MenuItem>
                          <MenuItem value={'MSgt'}>MSgt</MenuItem>
                          <MenuItem value={'2Lt'}>2Lt</MenuItem>
                          <MenuItem value={'1Lt'}>1Lt</MenuItem>
                          <MenuItem value={'Capt'}>Capt</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="shopLabel">Shop</InputLabel>
                        <Select
                          labelId="shopLabel"
                          label="Shop"
                          value={shop}
                          onChange={handleShop}
                          sx={{
                            marginBottom: 1,
                            color: 'black',
                          }}
                        >
                          <MenuItem value={121}>ELAB</MenuItem>
                          <MenuItem value={120}>Transportation</MenuItem>
                          <MenuItem value={123}>CFP</MenuItem>
                          <MenuItem value={124}>EMT</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  }
                  actions={
                    <Button onClick={() => handleUpdateUser()}>Submit</Button>
                  }
                />
                <Modal
                  open={isDeleteModalOpen}
                  onClose={closeDeleteModal}
                  content={
                    <>
                      <Typography color="black">
                        Are you sure you want to delete{' '}
                        {deletedUser.rank +
                          ' ' +
                          deletedUser.firstName +
                          ' ' +
                          deletedUser.lastName}
                        ?
                      </Typography>
                    </>
                  }
                  actions={
                    <Button onClick={() => handleDeleteUser()}>
                      Delete User
                    </Button>
                  }
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message={msg}
          action={action}
        />
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={shopUsers.totalCount}
          rowsPerPage={5}
          page={page}
          onPageChange={onPageChange}
        />
      </Box>
    </Card>
  )
}
