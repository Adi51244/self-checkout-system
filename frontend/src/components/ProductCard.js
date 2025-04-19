import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ProductCard = ({ product }) => {
  const { item, quantity, price, subtotal } = product;

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
            {item}
          </Typography>
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: '1rem !important' }} />}
            label={`₹${price}`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Quantity: {quantity}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            ₹{subtotal}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
