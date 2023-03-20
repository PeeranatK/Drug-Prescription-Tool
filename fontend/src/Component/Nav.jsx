import * as React from 'react';
//import AppBar from '@mui/material/AppBar';
//import Box from '@mui/material/Box';
//import Toolbar from '@mui/material/Toolbar';
//import Typography from '@mui/material/Typography';
//import IconButton from '@mui/material/IconButton';
//import MenuIcon from '@mui/icons-material/Menu';
import {GoogleLogin,GoogleLogout} from 'react-google-login';
import { Nav } from 'rsuite';
//import Drawer from '@mui/material/Drawer';
import { useState } from 'react';
//import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

export default function ButtonAppBar() {
  const history = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  }
  const onLogout = () => {
    //setProfile(null);
    localStorage.removeItem('user');
    history('/');
  }
  const handleLogout = () => {
    // setUser({});
    // setUsername("");
    // setPassword("");
    // localStorage.clear();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#28542f' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleSidebarToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Administration
          </Typography>
          <Nav>
            <GoogleLogout
              clientId="889381299945-0p5gfvqbq04tg8nbjp67dcspbkfff4hh.apps.googleusercontent.com"
              buttonText="Logout"
              onLogoutSuccess={onLogout}
            />
          </Nav>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isSidebarOpen} onClose={handleCloseSidebar}>
        {/* Sidebar content goes here */}
        <Box sx={{ width: 250 }}>
        <List>
          <Link to="/Dashboard">
          <ListItem button key="dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Suggestion" />
          </ListItem>
          </Link>
          <Link to="/DashboardInteraction">
          <ListItem button key="settings">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Interaction" />
          </ListItem>
          </Link>
        </List>

        </Box>
      </Drawer>
    </Box>
  );
}