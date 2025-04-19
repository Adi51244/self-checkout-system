import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Checkout from "../components/Checkout";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    clearCart();
    alert("Payment successful! Thank you for shopping.");
    navigate('/');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Checkout
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
            Your cart is empty. Start shopping!
          </Typography>
        ) : (
          <Checkout cart={cart} onCheckout={handleCheckout} />
        )}
      </Box>
    </Container>
  );
};

export default CheckoutPage;
