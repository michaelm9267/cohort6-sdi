import React from 'react'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'


const WebAppUsers = () => {
    const theme = useTheme();

    const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';

  return (
    <div>
              <Typography className={liClassName} variant="h1">Web App Users</Typography>
<div className='webUsers'>
                  <Typography className={liClassName} variant='h4'>Basic Shop Users</Typography>
          <ul className="basicShopUsersList">
            <li className={liClassName}>Normally maintenance</li>
            <li className={liClassName}>Request additions to catalog</li>
            <li className={liClassName}>Search and add parts to cart</li>
            <li className={liClassName}>Add/Edit shop</li>
        </ul>
            <div className="adminUsers">
              <Typography className={liClassName} variant='h4'>Admin Users</Typography>
              <ul>
                <li className={liClassName}>LRS Customer Support team</li>
                <li className={liClassName}>Approve and edit catalog additions, user requests, and orders</li>
              </ul>
            </div>
            <div className="transportUser">
              <Typography className={liClassName} variant='h4'>Transport Users</Typography>
              <ul>
                <li className={liClassName}>LRS Ground Transportation team</li>
                <li className={liClassName}>Track and confirm delivered and completed orders</li>
              </ul>
            </div>
</div>
    </div>
  )
}

export default WebAppUsers