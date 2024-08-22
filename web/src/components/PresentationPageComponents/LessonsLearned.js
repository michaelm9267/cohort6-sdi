import { Box, Typography, Stack } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

const LessonsLearned = () => {
  const theme = useTheme()

  const liClassName = theme.palette.mode === 'dark' ? 'dark-li' : 'light-li'

  return (
    <div>
      <Typography className={liClassName} textAlign={'center'} variant="h1">
        Closing Remarks
      </Typography>
      <Box
        display={'flex'}
        gap={5}
        justifyContent={'center'}
        fontWeight={'bold'}
      >
        <Box className="listContainer">
          <Typography className={liClassName} variant="h2">
            Frequently Asked Questions
          </Typography>
          <ul>
            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                Q: Could this be used as is?
              </Typography>
            </li>
            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                A: Unfortunately no. More parts, bases and shops will need to be
                added
              </Typography>
            </li>

            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                Q: Does this replace any current software or processes?
              </Typography>
            </li>
            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                A: It doesn't replace any software, but it will replace several
                processes
              </Typography>
            </li>

            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                Q: Can this be integrated with Envision?
              </Typography>
            </li>
            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                A: Absolutely. While no data set existed when we began this
                project, one was just created 2 weeks ago that will help scale
                out our project. Conversely, this could be used by Envision to
                create a dataset for tracking trends.
              </Typography>
            </li>
          </ul>
        </Box>
        <br></br>
        <Box className="listContainer">
          <Typography className={liClassName} variant="h2">
            Lessons Learned
          </Typography>
          <ul>
            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                RedwoodJS is a very powerful framework
              </Typography>
            </li>

            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                 MUI Template probably gave us the most trouble to integrate and use
              </Typography>
            </li>

            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                As brand new developers it was a great experience to be mentored
                and guided by such expert developers
              </Typography>
            </li>

            <li className={liClassName}>
              <Typography sx={{ fontSize: '1.70em' }}>
                Most of us have little to none actual coding experience. That
                this is our finished project is nothing short of impressive.
                This is living proof that this program is successful.
              </Typography>
            </li>
          </ul>
        </Box>
      </Box>
    </div>
  )
}

export default LessonsLearned
