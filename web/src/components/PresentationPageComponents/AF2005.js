import React from 'react'
import AFForm2005 from './images/AF2005.png'
import { Typography } from '@mui/material'

const AF2005 = () => {
  return (
    <div style={{ minWidth: '1600px', minHeight: '700px'}}>
      <Typography sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' }} variant="h1">AF Form 2005</Typography>
      <div style={{textAlign: "center"}}>
        <img
          src={AFForm2005}
          style={{
            width: '1050px',
            margin: "auto",
            padding: '5% 5%',
            backgroundColor: 'rgba(221, 220, 220, 0.292)',
            borderRadius: '5px',
          }}
        />
      </div>
    </div>
  )
}

export default AF2005
