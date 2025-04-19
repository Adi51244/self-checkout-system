import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Stack, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocalMallIcon from '@mui/icons-material/LocalMall';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalMallIcon color="primary" />
              <Typography variant="h6" color="text.primary" fontWeight={600}>
                VyapaarAI
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Making shopping smarter with AI-powered self-checkout. Experience the future of retail with our intelligent detection system.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Typography
                component={RouterLink}
                to="/about"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                About Us
              </Typography>
              <Typography
                component="a"
                href="#"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                component="a"
                href="#"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                Terms of Service
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" color="text.primary" fontWeight={600} gutterBottom>
              Contact Info
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Email: info@vyapaarai.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: +1 (555) 123-4567
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: 123 AI Street, Tech City, 12345
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} VyapaarAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;