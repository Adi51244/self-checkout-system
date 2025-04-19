import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import CheckoutPage from "./pages/CheckoutPage";
import AboutUs from "./pages/AboutUs";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Route wrapper to handle auth redirects
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} /> : <LoginPage />
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CheckoutPage />
        </ProtectedRoute>
      } />

      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
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
            <AppRoutes />
          </Box>
          <Footer />
        </Box>
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;
