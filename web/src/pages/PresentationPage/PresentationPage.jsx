import { Link, routes } from '@redwoodjs/router'
import SACLogo from '../../../public/SAC logo new.png'
import STLogo from '../../../public/ST emblem.png'
import StkWrxLogo from '../../components/PresentationPageComponents/images/StrikewerxLogo.png'
import { Button, Divider, Typography } from '@mui/material'
import presentationComponents from '../../components/PresentationPageComponents/componentsArray'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'

import { Box, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

const PresentationPage = () => {
  const [index, setIndex] = useState(1)

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Request fullscreen
      const elem = document.documentElement; // For fullscreen mode on the whole page
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } 
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      }
    }
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  const prevSlide = (arr) => {
    setIndex(index - 1)
    if (index == 1) {
      setIndex(arr.length)
    }
  }

  const nextSlide = (arr) => {
    setIndex(index + 1)
    if (index == arr.length) {
      setIndex(1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            nextSlide(presentationComponents);
        }
        if (e.key === "ArrowLeft") {
          prevSlide(presentationComponents);
        }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
    };
}, [index, presentationComponents]);

  return (
<>
<Button onClick={toggleFullScreen} className="fullscreenButton">
        Toggle Fullscreen
      </Button>
      <Box
        className="presentationContainer"
  
  
      >
  <Stack>
    <Box className="header">
      {index !== 1 ? (
      <Stack>
<Box className="header">
        <img src={SACLogo} className="Logo" />
        <Typography variant="h3" className='title' sx={{width: 650, color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}} noWrap>SDI Team Members</Typography>
        <img src={STLogo} className="Logo" />
</Box>
      </Stack>
  ) : null}
    </Box>
{index !== 1 ? (
      <Stack><Divider className='divider' />
            </Stack>
  ) : null}
  <Box className="mainBody">
            <Box className="sldeInfomationCnt">
              <Box
                className="buttonContainer prevCont"
               
              >
                <Button
                  onClick={() => prevSlide(presentationComponents)}
                  className="button prevButton"
                  
                  
                >
                  <ArrowCircleDownIcon  className='arrowIcon' />
                </Button>
              </Box>
              <Box>
                {presentationComponents.map((component) => {
                  if (index === component.id) return <>{component.component}</>
                })}
              </Box>
              <Box
                className="buttonContainer nextCont" >
                <Button
                  onClick={() => nextSlide(presentationComponents)}
                  className="button nextButton"
                  sx={{}}
  
                >
                  <ArrowCircleDownIcon className='arrowIcon' />
                </Button>
              </Box>
            </Box>
            <Box className="strkWerxLogoContainer">
              <img src={StkWrxLogo} className="strkWerxLogo" />
            </Box>
  </Box>
        </Stack>
      </Box>
</>
  )
}

export default PresentationPage
