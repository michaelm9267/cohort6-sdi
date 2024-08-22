import React from 'react'
import Register from "./images/Register.png"
import listOfUnits from "./images/ListOfUnits.png"
import Inventory from "./images/Inventory.png"
import orderDetails from "./images/OrderDetails.png"
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Design = () => {
  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  return (
 <div>
    <Typography className={liClassName} variant='h1'>Design</Typography>
        <div className='imageGrid'>
            <img src={Register} className='register'/>
            <img src={listOfUnits} className='listOfUnits'/>
            <img src={Inventory} className='inventory'/>
            <img src={orderDetails} className='orderDetails'/>
            </div>
 </div>

  )
}

export default Design