import { useParams } from '@redwoodjs/router'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import SearchResultsCell from 'src/components/SearchResultsCell/SearchResultsCell'
import SearchResultsDrawer from 'src/components/SearchResultsDrawer/SearchResultsDrawer'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useState, useRef } from 'react'

const SearchResultsPage = () => {
  const { query } = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpenDrawer = (item) => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <Divider />
      <Box display="flex" minWidth="1500px" overflow="auto">
        <Stack width={isOpen ? `calc(100% - 25%)` : '100%'}>
      <Typography variant="h4" sx={{margin: '20px 0 28px 35px'}} color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}>Results</Typography>
      <Divider />
          <Box >
            <SearchResultsCell
              term={query}
              onOpenDrawer={handleOpenDrawer}
              isOpen={isOpen}
              setSelectedItem={setSelectedItem}
              limit={!query ? 15 : undefined}
            />
          </Box>
        </Stack>
        {isOpen && (
          <Box width="100" flexShrink={1} >
            <SearchResultsDrawer
              isOpen={isOpen}
              selectedItem={selectedItem}
              setIsOpen={setIsOpen}
            />
          </Box>
        )}
      </Box>
    </div>
  )
}

export default SearchResultsPage
