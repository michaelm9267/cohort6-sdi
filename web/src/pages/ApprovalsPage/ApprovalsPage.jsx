import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAuth } from 'src/auth';
import { useDialog } from '../../../../template/src/hooks/use-dialog';
import { Seo } from '../../../../template/src/components/seo';
import { OrderListContainer } from 'src/components/OrderListContainer/OrderListContainer';
import ApprovalsDrawer from 'src/components/ApprovalsDrawer/ApprovalsDrawer';
import ApprovalsCell from 'src/components/ApprovalsCell/ApprovalsCell';

const tabOptions = [
  {
    label: 'Parts',
    value: 'parts',
  },
  {
    label: 'Users',
    value: 'users',
  },
];

const sortOptions = [
  {
    label: 'Newest',
    value: 'desc',
  },
  {
    label: 'Oldest',
    value: 'asc',
  },
];

const useCurrentApproval = (approvals, approvalId) => {
  // console.log("current approvals")
  // console.log(approvals)
  return useMemo(() => {
    if (!approvalId) {
      return undefined;
    }
    return approvals.find((approval) => approval.id === approvalId);
  }, [approvals, approvalId])
};

const ApprovalsPage = () => {
  // page states (search bar, tabs, pagination)
  const [sort, setSort] = useState('desc')
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState()
  const [status, setStatus] = useState('parts')
  const [currentTab, setCurrentTab] = useState('parts')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [approvals, setApprovals] = useState({
    approvals: [],
    approvalsLength: 0,
  })
  const rootRef = useRef(null)
  // defines row item that specifies drawer contents
  const dialog = useDialog()
  const { currentUser } = useAuth()
  const currentApproval = useCurrentApproval(approvals.approvals, dialog.data)
  // snackbar popup notification states
  const [openSnack, setOpenSnack] = useState(false);
  const [msg, setMsg] = useState("");

  const updateQuery = useCallback((event) => {
    event.preventDefault();
    setQuery(search)
  }, [search])

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabsChange = useCallback((event, tab) => {
    console.log(tab)
    setCurrentTab(tab);
    setStatus(tab)
    setPage(0); // reset to first page upon changing tabs
    dialog.handleClose();
  }, []);

  const updateApprovalsInStore = (filteredApprovals) => {
    console.log("deletion step 3 / 7 (cart page)")
    setApprovals({
      approvals: filteredApprovals,
      approvalsLength: filteredApprovals.length
    });
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const handleSubmit = (newMsg) => {
    const remainingapprovals = approvals.approvals.filter((approval) => approval.id !== currentApproval.id)
    updateApprovalsInStore(remainingapprovals)
    // When done hide dialog, show snackbar w/ new msg
    dialog.handleClose();
    setOpenSnack(true);
    setMsg(newMsg.toUpperCase());
  }

  const handleApprovalOpen = useCallback((approvalId) => {
    // Close drawer if is the same order
    if (dialog.open && dialog.data === approvalId) {
      dialog.handleClose();
      return;
    }
    dialog.handleOpen(approvalId);
  }, [dialog]);

  return (
    <>
      <Seo title="Dashboard: Approvals List" />
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <OrderListContainer open={dialog.open}>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4" color={(theme) => theme.palette.mode === 'dark' ? 'white' : 'black'}>Approvals</Typography>
                </div>
              </Stack>
            </Box>
            <Divider />
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                sx={{ px: 3 }}
                textColor="primary"
                value={status}
                variant="scrollable"
              >
                {tabOptions.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
              <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                gap={3}
                sx={{ p: 3 }}
              >
                <Box
                  component="form"
                  onSubmit={updateQuery}
                  sx={{ flexGrow: 1 }}
                >
                  <OutlinedInput
                    defaultValue=""
                    fullWidth
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    name="orderNumber"
                    placeholder="Search by part or order name, number, etc"
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgIcon>
                          <SearchMdIcon />
                        </SvgIcon>
                      </InputAdornment>
                    }
                  />
                </Box>
                <TextField
                  label="Sort By"
                  name="sort"
                  select
                  SelectProps={{ native: true }}
                  onChange={(event) => setSort(event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Stack>
            </div>
            <Divider />
            <ApprovalsCell
              sort={sort}
              query={query}
              shopID={currentUser.shopID}
              status={status}
              updateApprovalsInStore={updateApprovalsInStore}
              count={approvals.approvalsLength}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelect={handleApprovalOpen}
              page={page}
              rowsPerPage={rowsPerPage}
              openSnack={openSnack}
              msg={msg}
              handleCloseSnack={handleCloseSnack}
            />
          </OrderListContainer>
        </Container>
        <ApprovalsDrawer
          container={rootRef.current}
          onClose={dialog.handleClose}
          open={dialog.open}
          approval={currentApproval}
          onSubmit={handleSubmit}
        />
      </Box>
    </>
  );
};

export default ApprovalsPage
