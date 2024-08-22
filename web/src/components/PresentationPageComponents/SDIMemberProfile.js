import React from 'react'
import MichaelHeadshot from './images/MichaelsHeadshot.jpeg'
import loi from './images/loi.jpg'
import louis from './images/louis.jpg'
import kane from './images/kane.jpg'
import StkWrxLogo from "./images/StrikewerxLogo.png"
import '../../../src/styles/presentation.css'
import { Box, Typography, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const SDIMemberProfile = () => {

  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  return (
    <Stack
      style={{
        maxWidth: '2000px',
        maxHeight: '3000px',
      }}
    >
<Box
className="profileCnt"
>
    <Box
    className="individualProfile"
    >
          <img src={MichaelHeadshot} className="headshot" />
          <Box className="informationContainer">
            <Typography className={liClassName} variant="h2" sx={{fontSize: "1.3em"}}>Michael May</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Rank:</strong> E6 / Tech Sergeant</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Hometown:</strong> Lawton, OK</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}>
            <strong>AFSC:</strong> 2T071 
            </Typography>
            <Typography className={liClassName} sx={{fontSize: "1.3em"}}><strong>Duty Title: </strong>Section Chief Personal PPTY & PAX Trav</Typography>
            <Typography className={liClassName} sx={{fontSize: "1.3em"}}><strong>Unit:</strong> 7th LRS, Dyess AFB, TX</Typography>
          </Box>
        </Box>
    <Box
    className="individualProfile"
    >
          <img src={loi} className="headshot" />
          <Box className="informationContainer">
            <Typography className={liClassName} variant="h2" sx={{fontSize: "1.3em"}}>Loi Pham</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Rank:</strong> O2 / 1st Lieutenant</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Hometown:</strong> Silver Spring, Maryland</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}>
              <strong>AFSC:</strong> 17DA
            </Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}>
              <strong>Duty Title:</strong> OIC, Mission Defense Team
            </Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Unit:</strong> 2nd CS, Barksdale AFB, LA </Typography>
          
          </Box>
        </Box>
    <Box
    className="individualProfile"
    >
          <img src={louis} className="headshot" />
          <Box className="informationContainer">
            <Typography className={liClassName} variant="h2" sx={{fontSize: "1.3em"}}>Louis Toth</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Rank:</strong> E6 / Tech Sergeant</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Hometown:</strong> Shelter Island, NY</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}>
            <strong>AFSC:</strong> 2M0X1
            </Typography>
            <Typography className={liClassName} sx={{fontSize: "1.3em"}}><strong>Duty Title: </strong>NCOIC, EMT Quality Assurance</Typography>
            <Typography className={liClassName} sx={{fontSize: "1.3em"}}><strong>Unit:</strong> 341 MXG, Malmstrom AFB, MT</Typography>
          </Box>
        </Box>
    <Box
    className="individualProfile"
    >
          <img src={kane} className="headshot" />
          <Box className="informationContainer">
            <Typography className={liClassName} variant="h2" sx={{fontSize: "1.3em"}}>Gabriel Stokes</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Rank:</strong> E4 / Senior Airman</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}><strong>Hometown:</strong> Cairo, Georgia</Typography>
            <Typography className={liClassName}  sx={{fontSize: "1.3em"}}>
            <strong>AFSC:</strong> 2M0X1
            </Typography>
            <Typography className={liClassName} sx={{fontSize: "1.3em"}}><strong>Duty Title: </strong>Team Chief, Electronics Lab</Typography>
            <Typography className={liClassName} sx={{fontSize: "1.3em"}}><strong>Unit:</strong> 791 MXS, Minot AFB, ND</Typography>
          </Box>
        </Box>
</Box> 

  </Stack>
  )
}

export default SDIMemberProfile
