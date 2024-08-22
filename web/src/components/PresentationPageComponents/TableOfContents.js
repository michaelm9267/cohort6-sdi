import { Typography } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const TableOfContents = () => {
  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  return (
    <div className='tableOfContentsContainer'>
      <Typography className={liClassName} variant='h1'>Contents</Typography>
      <ul className='tableOfContent'>
        <li className={liClassName}>Biographies</li>
        <li className={liClassName}>Galvanize</li>
        <li className={liClassName}>Ruby Shore</li>
        <li className={liClassName}>Discovery & Design</li>
        <li className={liClassName}>App Concept Ideas</li>
      </ul>
    </div>
  )
}

export default TableOfContents