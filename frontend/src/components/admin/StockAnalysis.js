import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine 
} from 'recharts';
import { getStockLevelColor, formatCurrency } from '../../utils/adminUtils';

const StockAnalysis = ({ open, onClose, monthlyData = [], products = [] }) => {
  const currentMonth = monthlyData[monthlyData.length - 1] || { products: [] };
  const hasData = monthlyData.length > 0;
  
  // Calculate average and max stock for reference lines
  const avgStock = hasData ? 
    Math.round(monthlyData.reduce((sum, month) => sum + month.stock, 0) / monthlyData.length) : 0;
  const maxStock = hasData ? 
    Math.max(...monthlyData.map(month => month.stock)) : 0;
  
  // Sort products by status: Good (high stock) → Medium → Low
  const sortedProducts = currentMonth.products ? [...currentMonth.products].sort((a, b) => {
    // Helper function to get status priority (Good: 1, Medium: 2, Low: 3)
    const getStatusPriority = (stock) => {
      if (stock > 20) return 1; // Good
      if (stock > 10) return 2; // Medium
      return 3; // Low
    };
    
    return getStatusPriority(a.stockLevel) - getStatusPriority(b.stockLevel);
  }) : [];
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          width: '95vw',
          overflowY: 'auto'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Stock Analysis Dashboard</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Stock Level Trends</Typography>
            <Paper elevation={0} sx={{ p: 2, height: 500 }}>
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#666', fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fill: '#666', fontSize: 12 }}
                      width={60}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: '#666', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 8,
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        padding: '10px 14px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '10px',
                        fontSize: '14px'
                      }}
                    />
                    <ReferenceLine 
                      y={avgStock} 
                      yAxisId="left" 
                      label={{ value: 'Avg Stock', position: 'insideRight', fill: '#ff7300' }} 
                      stroke="#ff7300" 
                      strokeDasharray="3 3" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="stock" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorStock)"
                      name="Total Stock"
                      yAxisId="left"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSold)"
                      name="Items Sold"
                      yAxisId="right"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">No stock data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Current Stock Status</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Details</TableCell>
                    <TableCell align="right">Current Stock</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {product.sku && `SKU: ${product.sku} | `}Category: {product.category || 'Uncategorized'}
                            </Typography>
                            {product.description && (
                              <Typography variant="caption" color="text.secondary" sx={{display: 'block', maxWidth: 250}} noWrap>
                                {product.description.length > 40 ? `${product.description.substring(0, 40)}...` : product.description}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{product.stockLevel}</TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: getStockLevelColor(product.stockLevel) + '20',
                              color: getStockLevelColor(product.stockLevel),
                            }}
                          >
                            {product.stockLevel <= 10 ? 'Low' : product.stockLevel <= 20 ? 'Medium' : 'Good'}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(product.price * product.stockLevel)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">No products available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StockAnalysis;