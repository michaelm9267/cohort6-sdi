import { Typography } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const Galvanize = () => {
  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  return (
    <div className='galvanizeContainer'>
    <Typography variant='h1' className={liClassName}>Galvanize</Typography>
    <ul className='galvanize'>
      <li className={liClassName}>Educational agency selected to develop full-stack junior software engineers</li>
      <li className={liClassName}>12 week junior software development academics</li>
      <li className={liClassName}>Learned to build functional web apps</li>
      <li className={liClassName}>Prepared students to be part of a software development team</li>
      <li className={liClassName}>Languages: JavaScript, HTML/CSS, React, SQL</li>
      <li className={liClassName}>Other skills: Docker, Git, Knex, Postgres, Agile methodology</li>
      <li className={liClassName}>Provided “book-smarts”</li>
    </ul>
  </div>
  )
}

export default Galvanize