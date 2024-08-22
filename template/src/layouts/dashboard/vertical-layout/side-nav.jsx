import { useState } from 'react'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import LogOut01 from '../../../icons/untitled-ui/duocolor/log-out-01'
import { Logo } from '../../../components/logo'
import { Scrollbar } from '../../../components/scrollbar'
import { SideNavSection } from './side-nav-section'
import { useAuth } from '../../../../../web/src/auth'
import { paths } from '../../../paths'
import { Link, routes } from '@redwoodjs/router';



const SIDE_NAV_WIDTH = 280

export const SideNav = (props) => {
  const { isAuthenticated, currentUser, logOut, hasRole } = useAuth()
  const { color = 'evident', sections = [], isOpen, onToggleSideNav } = props
  const [sideNavVis, setSideNavVis] = useState({
    left: false,
  })

  const toggleSideNav = (anchor, open) => (event) => {
    if (Event.type === 'click') {
      return
    }
    setSideNavVis({ ...sideNavVis, [anchor]: open })
  }

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={() => onToggleSideNav(true)}
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%',
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)',
          },
        }}
      >
        <Stack
          sx={{
            height: '100%',
            width: '20vw',
            maxWidth: '400px',
            minWidth: '300px',
          }}
        >
          <Stack alignItems="center" direction="row" sx={{ p: 3 }}>
            <Box
              href={''}
              sx={{
                display: 'flex',
                height: 77,
                p: '4px',
                width: 199,
              }}
            >
              <Logo />
            </Box>
            <SvgIcon
              sx={{
                marginLeft: 'auto',
                borderRadius: '50%',
                padding: '5px',
                '&:hover': {
                  backgroundColor: 'lightgrey',
                  cursor: 'pointer',
                },
              }}
              onClick={() => onToggleSideNav(true)}
            >
              <CloseIcon />
            </SvgIcon>
          </Stack>
          <Stack
            component="nav"
            spacing={2}
            sx={{
              flexGrow: 1,
              px: 2,
            }}
          >
            {hasRole('basic') || hasRole('admin') || hasRole('transport') ?
            <Typography color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'} sx={{ mb: 2 }} variant="subtitle1">
              Welcome,{' '}
              {currentUser.rank +
                ' ' +
                currentUser.firstName +
                ' ' +
                currentUser.lastName}
            </Typography> : <></> }
            {sections.map((section, index) => (
              <SideNavSection items={section.items} key={index} />
            ))}
          </Stack>
          <Box sx={{ p: 3 }}>
            <Button
              component="a"
              fullWidth
              onClick={logOut}
              startIcon={
                <SvgIcon>
                  <LogOut01 />
                </SvgIcon>
              }
              target="_blank"
              variant="contained"
            >
              Log Out
            </Button>
          </Box>
        </Stack>
      </Scrollbar>
        <Stack sx={{mb: "5%", margin: "15px auto"}}  path={paths.presentation}>
          <Box
          >
              <Link to="/presentation">
                <Button
                  variant='contained'
                  target={paths.presentation}
                >
                <PresentToAllIcon />
                  Presentation
                </Button>
              </Link>
          </Box>
        </Stack>
    </Drawer>
  )
}

SideNav.propTypes = {
  color: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
  sections: PropTypes.array,
}
