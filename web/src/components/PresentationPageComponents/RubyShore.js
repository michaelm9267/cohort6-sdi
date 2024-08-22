import { Typography } from '@mui/material'
import RubyShoreLogo from "./images/RubyShoreLogo.png"
import React from 'react'
import { useTheme } from '@mui/material/styles'

const RubyShore = () => {
  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';


  return (
    <div className='rubyShoreContainer'>
    <div className='rubyShoreTitle'><Typography className={liClassName} variant='h1'>Ruby Shore</Typography><img src={RubyShoreLogo} /></div>
    <ul className='rubyShore'>
      <li className={liClassName}>Selected by Strikewerx to collaborate with USAF to provide web app production professional development for Airmen</li>
      <li className={liClassName}>Headquarters in Shreveport, LA</li>
      <li className={liClassName}>Full service digital agency</li>
      <li className={liClassName}>Specializes in custom software development, website design, mobile application development and online marketing</li>
      <li className={liClassName}>Mentored by Lead Software Engineer and Chief UI/UX Designer</li>
      <li className={liClassName}>12 week immersive web development experience based on industry standards</li>
      <li className={liClassName}>Provided “street-smarts”</li>
    </ul>
  </div>
  )
}

export default RubyShore