import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Log } from './logger';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

export default function App() {
  const [page, setPage] = useState<'all' | 'priority'>('all');

  const navigate = (p: 'all' | 'priority') => {
    Log('frontend', 'info', 'page', `Navigated to ${p} page`);
    setPage(p);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
          <Button color="inherit" onClick={() => navigate('all')}>All Notifications</Button>
          <Button color="inherit" onClick={() => navigate('priority')}>Priority Inbox</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        {page === 'all' ? <AllNotifications /> : <PriorityInbox />}
      </Box>
    </>
  );
}