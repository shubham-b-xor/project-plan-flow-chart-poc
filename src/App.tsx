import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { theme } from './theme';
import { store } from './store';

// Components
import TopBar from './components/TopBar/TopBar';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import PropertiesPanel from './components/PropertiesPanel/PropertiesPanel';

const SIDEBAR_WIDTH = 300;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <TopBar onMenuToggle={handleMenuToggle} sidebarOpen={sidebarOpen} />
          
          <Sidebar open={sidebarOpen} />
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'hidden',
              marginTop: '64px', // AppBar height
              // marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Canvas sidebarWidth={sidebarOpen ? SIDEBAR_WIDTH : 0} />
          </Box>
          
          <PropertiesPanel />
        </Box>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
