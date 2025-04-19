import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Container, Badge, Button } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <AppBar 
      position="sticky" 
      elevation={1} 
      sx={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to={user?.role === 'admin' ? '/admin' : '/'}
              sx={{ 
                color: 'text.primary', 
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <img 
                src="/images/VyapaarAi.png" 
                alt="VyapaarAI Logo" 
                style={{ height: '32px', width: 'auto' }}
              />
              VyapaarAI
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  // Admin Navigation
                  <Button
                    component={Link}
                    to="/admin"
                    startIcon={<DashboardIcon />}
                    variant={location.pathname === '/admin' ? 'contained' : 'outlined'}
                    color="primary"
                  >
                    Dashboard
                  </Button>
                ) : (
                  // Customer Navigation
                  <>
                    {location.pathname !== '/' && (
                      <Button
                        component={Link}
                        to="/"
                        startIcon={<HomeIcon />}
                        variant="outlined"
                        color="primary"
                      >
                        Home
                      </Button>
                    )}
                    
                    <IconButton 
                      color="primary"
                      component={Link} 
                      to="/checkout"
                      size="large"
                      sx={{
                        transition: 'all 0.2s',
                        bgcolor: location.pathname === '/checkout' ? 'primary.light' : 'primary.main',
                        color: 'white',
                        '&:hover': { 
                          transform: 'scale(1.1)',
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      <Badge 
                        badgeContent={cartCount} 
                        color="secondary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.75rem',
                            height: '20px',
                            minWidth: '20px',
                            fontWeight: 'bold'
                          }
                        }}
                      >
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </>
                )}
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  variant="outlined"
                  color="primary"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
