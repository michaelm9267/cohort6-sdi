import { ThemeProvider, createTheme } from '@mui/material/styles'
import { createTheme as createDarkTheme } from '../../../../template/src/theme/index'
import PropTypes from 'prop-types'

import { navigate } from '@redwoodjs/router'

import { useSettings } from '../../../../template/src/hooks/use-settings'
import { useSections } from '../../../../template/src/layouts/dashboard/config'
import { VerticalLayout } from '../../../../template/src/layouts/dashboard/vertical-layout'
import { useState, useMemo, useEffect } from 'react'


export const Layout = (props) => {
  const settings = useSettings()
  const sections = useSections()
  const navigateToSearchResults = (value) => {
    navigate(`/search-results?query=${value}`)
  }

  const basedTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1500,
        xl: 1700,
      },
    },
  })

  const lightTheme = createDarkTheme({
    colorPreset: settings.colorPreset,
    contrast: settings.contrast,
    direction: settings.direction,
    paletteMode: 'light',
    responsiveFontSizes: settings.responsiveFontSizes,
    stretch: settings.stretch,
    layout: settings.layout,
    navColor: settings.navColor,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1500,
        xl: 1700,
      },
    },
  })

  const darkTheme = createDarkTheme({
    colorPreset: settings.colorPreset,
    contrast: settings.contrast,
    direction: settings.direction,
    paletteMode: 'dark',
    responsiveFontSizes: settings.responsiveFontSizes,
    stretch: settings.stretch,
    layout: settings.layout,
    navColor: settings.navColor,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1500,
        xl: 1700,
      },
    },
  })

  const handleMode = (value1, value2) => {
    if (value1 === 'dark') {
      setChecked(value2)
      localStorage.setItem("checked", JSON.stringify('true'));
      console.log('checked set to true')
      console.log(localStorage.getItem("checked"))

      setMode(value1)
      localStorage.setItem("mode", JSON.stringify('dark'));
      console.log('mode switched to dark')
      console.log(localStorage.getItem("mode"))

      setTheme(darkTheme)
      localStorage.setItem("theme", JSON.stringify('dark'));
      console.log('theme set to dark')
      console.log(localStorage.getItem("theme"))

      document.body.style = 'background: black'
      return;
    }
    setChecked(value2)
    localStorage.setItem("checked", JSON.stringify('false'));
    console.log('checked set to false')

    setMode(value1)
    localStorage.setItem("mode", JSON.stringify('light'));
    console.log('mode switched to light')

    setTheme(lightTheme)
    localStorage.setItem("theme", JSON.stringify('light'));
    console.log('theme set to light')

    document.body.style = 'background: white'
  }

  const browseStorage = (value, type) => {
    if (value === undefined) {
      if (type === 'theme') {
        console.log('theme undefined')
        return lightTheme
      } else if (type === 'mode') {
        console.log('mode undefined')
        document.body.style = 'background: white'
        return 'light'
      } else if (type === 'checked') {
        console.log('checked undefined')
        return false
      }
    }

    if (type === 'theme') {
      console.log('theme is being changed')
      console.log(localStorage.getItem("theme"))
      return value === 'dark' ? darkTheme : lightTheme
    } else if (type === 'mode') {
      if (value === "dark") {
        console.log('mode is dark, switching background to black')
        console.log(localStorage.getItem("mode"))
        document.body.style = 'background: black'
        return 'dark'
      } else {
        console.log('mode is light, switching background to white')
        console.log(JSON.parse(localStorage.getItem("mode")) === "dark")
        document.body.style = 'background: white'
        return 'light'
      }
    } else if (type === 'checked') {
      console.log('checking checked')
      console.log(localStorage.getItem("checked"))
      return value === "true" ? true : false
    }
  }

  const [checked, setChecked] = useState(browseStorage(JSON.parse(localStorage.getItem("checked")), 'checked'))
  const [mode, setMode] = useState(browseStorage(JSON.parse(localStorage.getItem("mode")), 'mode'))
  const [theme, setTheme] = useState(browseStorage(JSON.parse(localStorage.getItem("theme")), 'theme'))

  console.log(theme)

  return (
    <ThemeProvider theme={theme}>
      <VerticalLayout
        sections={sections}
        onSearch={navigateToSearchResults}
        handleMode={handleMode}
        mode={mode}
        checked={checked}
        {...props}
      />
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}
