import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd'
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { NotificationsButton } from '../notifications-button'
import { useCallback, useEffect, useState } from 'react'

const TOP_NAV_HEIGHT = 64
const SIDE_NAV_WIDTH = 280

export const TopNav = (props) => {
  const { onSearch, onToggleSideNav, handleMode, mode, checked, ...other } = props
  const [searchValue, setSearchValue] = useState('')
  const [value, setValue] = useState('')
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchValue(value)
    if (e.key == 'Enter') {
      onSearch(searchValue)
      setSearchValue("")
      e.target.value = ""
    }
  }

  return (
    <Box component="header">
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        maxWidth="2000px"
        margin="0 auto"
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 2,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          sx={{ width: 1 }}
        >
          <IconButton onClick={onToggleSideNav}>
            <Menu01Icon />
          </IconButton>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleSubmit}
            label="Search"
            sx={{
              width: 1,
            }}
            type="text"
          />
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{ ml: 'auto' }}
        >
          <NotificationsButton />
          <FormControlLabel control={<Switch checked={checked} onChange={() => handleMode((mode === "light" ? "dark" : "light"), !checked)} />} label={<Typography variant="body2" color={mode === "light" ? "black" : "white"}>Dark</Typography>} />
        </Stack>
      </Stack>
    </Box>
  )
}

TopNav.propTypes = {
  onMobileNavOpen: PropTypes.func,
}
