import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
  Fade,
  Stack,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Webcam from "react-webcam";
import { detectProducts } from "../utils/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const { addToCart } = useCart();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async (imageBlob) => {
    if (!imageBlob) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", imageBlob);

    try {
      const result = await detectProducts(formData);
      if (result) {
        setProducts(result.bill.items);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error detecting products. Please try again.',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "webcam-capture.png", { type: "image/png" });
          setImage(file);
          setPreview(imageSrc);
          handleDetect(file);
          if (!realTimeMode) {
            setShowWebcam(false);
          }
        });
    }
  }, [webcamRef, realTimeMode]);

  useEffect(() => {
    if (showWebcam && realTimeMode) {
      // Start real-time detection
      detectionIntervalRef.current = setInterval(() => {
        captureImage();
      }, 1000); // Detect every second
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [showWebcam, realTimeMode, captureImage]);

  const handleAddToCart = () => {
    if (products.length === 0) return;
    
    addToCart(products);
    setSnackbar({
      open: true,
      message: 'Items added to cart successfully!',
      severity: 'success'
    });
    setProducts([]);
    setImage(null);
    setPreview(null);
  };

  const getTotal = () =>
    products.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const toggleRealTimeMode = (event) => {
    setRealTimeMode(event.target.checked);
    if (!event.target.checked) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 4,
              border: '2px dashed',
              borderColor: 'divider',
              bgcolor: 'background.default',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
              position: 'relative'
            }}
            onClick={() => !showWebcam && fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />

            {showWebcam ? (
              <Box>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  style={{ width: '100%', borderRadius: '16px' }}
                />
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={realTimeMode}
                        onChange={toggleRealTimeMode}
                        color="primary"
                      />
                    }
                    label="Real-time Detection"
                  />
                  {!realTimeMode && (
                    <Button
                      variant="contained"
                      onClick={captureImage}
                    >
                      Capture Photo
                    </Button>
                  )}
                </Stack>
              </Box>
            ) : preview ? (
              <Box sx={{ position: 'relative' }}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    borderRadius: 16,
                    objectFit: 'contain'
                  }} 
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWebcam(true);
                    }}
                  >
                    <VideocamIcon />
                  </IconButton>
                </Stack>
              </Box>
            ) : (
              <Box sx={{ py: 8 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48 }} />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWebcam(true);
                    }}
                  >
                    <VideocamIcon sx={{ fontSize: 48 }} />
                  </IconButton>
                </Stack>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Upload or Take a Photo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose how you want to capture the products
                </Typography>
              </Box>
            )}
          </Paper>
          
          {!showWebcam && (
            <Button
              variant="contained"
              onClick={() => handleDetect(image)}
              disabled={!image || loading}
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Detect Products'
              )}
            </Button>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Detected Items
            </Typography>
            
            {products.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography>
                  {showWebcam && realTimeMode 
                    ? 'Point your camera at products to detect them'
                    : 'Upload an image to detect products'}
                </Typography>
              </Box>
            ) : (
              <Fade in>
                <Box>
                  <Box sx={{ mb: 2 }}>
                    {products.map((product, idx) => (
                      <ProductCard key={idx} product={product} />
                    ))}
                  </Box>
                  <Stack spacing={2}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'primary.main', 
                        color: 'primary.contrastText',
                        borderRadius: 3
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total Bill: ₹{getTotal()}
                      </Typography>
                    </Paper>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="large"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
