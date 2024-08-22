import React from 'react'

import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ClosingContent = () => {
  const theme = useTheme()

  const liClassName = theme.palette.mode === 'dark' ? 'dark-li' : 'light-li'

  return (
    <div>
      <Typography className={liClassName} textAlign={'center'} variant="h1">
        Closing Remarks
      </Typography>
      <Box className="ClosingContentCnt">
        <Box
          display={'flex'}
          gap={5}
          justifyContent={'center'}
          fontWeight={'bold'}
        >
          <Box className="listContainer">
            <Typography className={liClassName} variant="h2">
              Future Features
            </Typography>
            <ul>
              <li className={liClassName}>
                <Typography className={liClassName} sx={{ fontSize: '1.5em' }}>
                  CAC Authentication
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Break down user roles to include supervisor and NCOIC
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography className={liClassName} sx={{ fontSize: '1.5em' }}>
                  Add email notification capability
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Add the ability to see the details of a part that is awaiting
                  approval
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Add the ability to turn in a part as well
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Add a tracking link in the order details
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Add a map to the unit home page
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Implement tablet capability
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Implement QR code capability
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Ability to add an item to your inventory outside of an order
                </Typography>
              </li>
            </ul>
          </Box>
          <br></br>
          <Box className="listContainer">
            <Typography className={liClassName} variant="h2">
              Encountered Problems
            </Typography>
            <ul>
              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Learning how to use Redwood
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Figuring out how the template functions and trimming it to
                  suit our needs
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Marrying Redwood and MUI together
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Dealing with an already shorter time line and then all of the
                  holidays we had
                </Typography>
              </li>

              <li className={liClassName}>
                <Typography sx={{ fontSize: '1.5em' }}>
                  Learning how to use GitHub successfully as a team
                </Typography>
              </li>
            </ul>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default ClosingContent
