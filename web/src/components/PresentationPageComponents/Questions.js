import React from 'react'
import { Box, Typography } from '@mui/material'
import skySupplyLogo from './images/SkySupplyLogo.png'

const Questions = () => {
  return (
    <div>
    <Box className="coverPage">
      <div style={{ textAlign: 'center' }}>
        <img
          style={{
            width: '500px',
            imageRendering: 'auto',
            objectFit: 'contain',
          }}
          src={skySupplyLogo}
        />
      </div>
      <Typography sx={{ textAlign: 'center', fontSize: '80px', fontWeight: "bolder", color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' }}>
        Questions?
      </Typography>
    </Box>
  </div>
  )
}

export default Questions