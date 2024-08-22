import { useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import XIcon from '@untitled-ui/icons-react/build/esm/X'
import PropTypes from 'prop-types'

import ProductDetails from '../ProductDetails/ProductDetails'
import ProductEdit from '../ProductEdit/ProductEdit'

const ProductDrawer = (props) => {
  const { container, onClose, open, product, onDelete } = props
  const [isEditing, setIsEditing] = useState(false)

  const handleEditOpen = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleEditCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  let content = null

  if (product) {
    content = (
      <div>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Typography color="inherit" variant="h6">
            {product.name}
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 3,
            py: 4,
          }}
        >
          {!isEditing ? (
            <ProductDetails
              onDelete={onDelete}
              onApprove={onClose}
              onEdit={handleEditOpen}
              onReject={onClose}
              product={product}
            />
          ) : (
            <ProductEdit onCancel={handleEditCancel} product={product} onClose={onClose} closeEdit={setIsEditing} />
          )}
        </Box>
      </div>
    )
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      PaperProps={{
        sx: {
          position: 'relative',
          width: 500,
        },
      }}
      SlideProps={{ container }}
      variant="persistent"
    >
      {content}
    </Drawer>
  )
}

ProductDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.object,
}

export default ProductDrawer
