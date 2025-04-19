import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Container, Badge, Button } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  
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
              to="/"
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
            {location.pathname !== '/' && (
              <Button
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
                variant="outlined"
                color="primary"
                sx={{ 
                  fontWeight: 500,
                  '&:hover': { 
                    bgcolor: 'primary.light',
                    color: 'white'
                  }
                }}
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
