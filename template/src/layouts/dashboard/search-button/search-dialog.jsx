import { useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// import { Tip } from '../../../components/tip';
import { wait } from '../../../utils/wait';

export const SearchDialog = (props) => {
  const { onClose, open = false, onSearch, ...other } = props;
  const [value, setValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSearch(value)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6">Search</Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        {/* <Tip message="Search by entering a keyword and pressing Enter" /> */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
            label="Search"
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search..."
            value={value}
            type='text'
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

SearchDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
