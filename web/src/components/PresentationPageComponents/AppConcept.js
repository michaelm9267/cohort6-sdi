import React from 'react'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const AppConcept = () => {
  const theme = useTheme();

  const liClassName =  theme.palette.mode === 'dark' ? 'dark-li' : 'light-li';
  return (
    <div className="AppConceptContainer">
      <Typography className={liClassName} variant="h1">App Concept Idea</Typography>
      <ul className="AppConceptList">
        <li className={liClassName}>
          <strong className={`${liClassName} keyword`}>Problem Statement: </strong></li> 
<ul >
           <li className={liClassName}>
              <span className='problemStatement'>
                AFGSC maintenance units do not have a process that expedites order
                submissions and maintains visibility on order logistics for
                maintenance parts that are crucial for operating equipment.
              </span>
           </li>
</ul>
        
        <div className="currentIssues">
          <li className={liClassName}>Current issues:</li>
          <ul>
            <li className={liClassName}>A LOT of physical paperwork and man-hours</li>
            <li className={liClassName}>Manual error tracking</li>
            <li className={liClassName}>Little to no visibility on tracking orders or documents (AF-2005)</li>
            <li className={liClassName}>Little to no streamline communication between maintenance and logistics units</li>
            <li className={liClassName}>
            No standardized way of viewing order history
            </li>
            <li className={liClassName}>No easy way to repeat orders</li>
          </ul>
        </div>
        <div className="stakeholders">
          <li className={liClassName}>Stakeholders:</li>
          <ul>
            <li className={liClassName}>Maintenance units - technicians</li>
            <li className={liClassName}>Logistics units - customer/unit support, delivery and transport services</li>
          </ul>
        </div>
      </ul>
    </div>
  )
}

export default AppConcept
