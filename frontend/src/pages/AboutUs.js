import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

const AboutUs = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
          About VyapaarAI
        </Typography>
        
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            VyapaarAI is revolutionizing retail with our state-of-the-art smart self-service checkout system. By combining artificial intelligence with intuitive self-checkout solutions, we're transforming the way people shop, making it faster, smarter, and more convenient than ever before.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Our advanced computer vision and machine learning technologies power a seamless self-checkout experience that automatically recognizes products through images - no barcodes needed. Simply show your items to the camera, and let our AI handle the rest.
          </Typography>
        </Paper>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CameraEnhanceIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Intelligent Product Recognition
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Our AI-powered system instantly identifies products through our smart cameras. No more searching for barcodes or PLU codes - just place your items in view, and our system recognizes them automatically with exceptional accuracy.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SmartphoneIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Seamless Self-Service Experience
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Complete your purchase independently with our intuitive interface. Real-time product detection, automatic pricing, and instant cart updates make self-checkout faster and more efficient than traditional methods.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Key Benefits
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <SpeedIcon color="secondary" />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Lightning-fast checkout process - up to 3x faster than traditional methods
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <SecurityIcon color="secondary" />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Enhanced accuracy with AI-powered product recognition
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <ShoppingCartIcon color="secondary" />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Zero queues with multiple self-service stations
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <AutoAwesomeIcon color="secondary" />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Contactless and modern shopping experience
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Future Vision
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            We're continuously enhancing our self-service technology and expanding our AI capabilities. Our vision is to make VyapaarAI the gold standard for automated retail checkout systems, bringing the future of shopping to stores worldwide.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Experience the next generation of retail with our smart self-service checkout system - where advanced AI meets customer convenience.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutUs;