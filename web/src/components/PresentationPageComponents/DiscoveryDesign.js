import { Typography } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const DiscoveryDesign = () => {
  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  return (
      <div className='DDContainer'>
      <Typography sx={{color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}}variant='h1'>Discovery & Design</Typography>
      <ul className='DD'>
        <li className={liClassName}>3 weeks</li>
        <li className={liClassName}>How to make users comfortable with web app</li>
        <div className='DDbreakdown'>
<div className='discovery'>
          <li className={liClassName}>Discovery:</li>
          <ul>
          <li className={liClassName}>Problem statement / goal</li>
            <li className={liClassName}>Functions into pages</li>
            <li className={liClassName}>Users</li>
            <li className={liClassName}>Limiting factors (time, design layout & framework options, limited time with SMEs related to problem statement)</li>
          </ul>
</div>

<div className='design'>
          <li className={liClassName}>Design:</li>
          <ul>
            <li className={liClassName}>Blueprints save time and thinking during production</li>
            <li className={liClassName}>Flowcharts: page navigation</li>
            <li className={liClassName}>Wireframes: visual concepts for testing flow and functions</li>
            <li className={`${liClassName} ddimportant`}>Easier to edit blueprints during design than to edit code during production</li>
          </ul>
          </div>
</div>
        <li className={liClassName}>Avoids scope creep by defining requirements and limitations before production (HUGE industrial issue) - keeps production controlled and reasonable</li>
      </ul>
    </div>
  )
}

export default DiscoveryDesign