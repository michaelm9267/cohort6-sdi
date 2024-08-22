import React from 'react'
import { Box, Typography } from '@mui/material'
import skySupplyLogo from './images/SkySupplyLogo.png'

const CoverPage = () => {
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
        <Typography sx={{ textAlign: 'center', fontSize: '50px', color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' }}>
          Presented by the SDI Team
        </Typography>
      </Box>
    </div>
  )
}

export default CoverPage
