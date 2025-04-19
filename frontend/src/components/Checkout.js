import React from "react";
import { Button, Box, Typography, Paper, Divider, Container, Grid, IconButton } from "@mui/material";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCart } from "../context/CartContext";

const Checkout = ({ cart, onCheckout }) => {
  const { removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + (item.subtotal || item.price), 0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Cart Summary
            </Typography>
            <Box sx={{ my: 3 }}>
              {cart.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    py: 2,
                    alignItems: 'center'
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item.item || item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity || 1}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        ₹{item.subtotal || item.price}
                      </Typography>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => removeFromCart(index)}
                        sx={{ 
                          '&:hover': { 
                            bgcolor: 'error.light',
                            color: 'error.contrastText'
                          } 
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  {index < cart.length - 1 && (
                    <Divider sx={{ opacity: 0.5 }} />
                  )}
                </Box>
              ))}
            </Box>
            
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              p: 2.5,
              borderRadius: 3,
              mt: 3
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  ₹{total}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={onCheckout}
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              startIcon={<ShoppingCartCheckoutIcon />}
            >
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
