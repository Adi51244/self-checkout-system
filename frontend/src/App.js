import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import CheckoutPage from "./pages/CheckoutPage";
import AboutUs from "./pages/AboutUs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

const App = () => (
  <CartProvider>
    <Router>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flex: '1 0 auto',
            bgcolor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  </CartProvider>
);

export default App;
