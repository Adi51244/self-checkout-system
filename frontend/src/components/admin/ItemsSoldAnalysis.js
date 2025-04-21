import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/adminUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ItemsSoldAnalysis = ({ open, onClose, monthlyData = [] }) => {
  // Check if monthlyData exists and has length
  const hasData = monthlyData && monthlyData.length > 0;
  
  // Use safe fallback for currentMonth
  const currentMonth = hasData ? monthlyData[monthlyData.length - 1] : { products: [] };

  // Calculate product quantity data for current month
  const productQuantityData = (currentMonth.products || [])
    .map(product => ({
      name: product.name || 'Unknown Product',
      sold: product.sold || 0,
      stock: product.stock || 0,
      price: product.price || 0
    }))
    .filter(product => product.sold > 0)
    .sort((a, b) => b.sold - a.sold);

  // Prepare data for category-wise sales pie chart
  const uniqueCategories = {};
  (currentMonth.products || []).forEach(product => {
    const category = product.category || 'Other';
    if (!uniqueCategories[category]) {
      uniqueCategories[category] = 0;
    }
    uniqueCategories[category] += product.sold || 0;
  });
  
  const categoryData = Object.keys(uniqueCategories).map(category => ({
    name: category,
    value: uniqueCategories[category]
  })).sort((a, b) => b.value - a.value);

  // Calculate month-over-month growth
  const calculateGrowth = () => {
    if (monthlyData.length < 2) return { growth: 0, percentage: '0%' };
    
    const current = monthlyData[monthlyData.length - 1];
    const previous = monthlyData[monthlyData.length - 2];
    
    if (!current || !previous) return { growth: 0, percentage: '0%' };
    
    const currentSales = (current.products || []).reduce((sum, p) => sum + (p.sold || 0), 0);
    const previousSales = (previous.products || []).reduce((sum, p) => sum + (p.sold || 0), 0);
    
    if (previousSales === 0) return { growth: currentSales, percentage: '100%' };
    
    const growthValue = currentSales - previousSales;
    const growthPercentage = (growthValue / previousSales) * 100;
    
    return {
      growth: growthValue,
      percentage: `${growthPercentage.toFixed(1)}%`
    };
  };

  const growthData = calculateGrowth();
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box 
          sx={{ 
            bgcolor: 'background.paper', 
            p: 2, 
            borderRadius: 1,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="subtitle2" color="text.primary">
            {payload[0].payload.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sold: {payload[0].value} units
          </Typography>
          {payload[0].payload.price && (
            <Typography variant="body2" color="text.secondary">
              Price: {formatCurrency(payload[0].payload.price)}
            </Typography>
          )}
          {payload[0].payload.stock !== undefined && (
            <Typography variant="body2" color="text.secondary">
              In stock: {payload[0].payload.stock} units
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Items Sold Analysis</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Items Sold by Product</Typography>
              {growthData.growth !== 0 && (
                <Typography 
                  component="span" 
                  sx={{ 
                    ml: 2, 
                    color: growthData.growth > 0 ? 'success.main' : 'error.main',
                    fontSize: '0.9rem'
                  }}
                >
                  {growthData.growth > 0 ? '▲' : '▼'} {growthData.percentage} from last month
                </Typography>
              )}
              {hasData && productQuantityData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%', height: '90%', mt: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productQuantityData.slice(0, 15)} // Show top 15 products
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="sold" name="Units Sold" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No product sales data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Top Selling Products</Typography>
              {productQuantityData.length > 0 ? (
                <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Units Sold</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Stock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productQuantityData.slice(0, 10).map((product, index) => (
                        <TableRow 
                          key={product.name}
                          sx={{ 
                            bgcolor: index < 3 ? `${COLORS[index]}10` : 'inherit',
                            '&:hover': {
                              bgcolor: index < 3 ? `${COLORS[index]}20` : 'rgba(0,0,0,0.04)'
                            }
                          }}
                        >
                          <TableCell>
                            <Typography 
                              component="span" 
                              sx={{ 
                                color: index < 3 ? COLORS[index] : 'text.primary',
                                fontWeight: index < 3 ? 600 : 400,
                                fontSize: '14px'
                              }}
                            >
                              #{index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: '14px' }}>{product.name}</TableCell>
                          <TableCell align="right" sx={{ fontSize: '14px', fontWeight: index < 3 ? 600 : 400 }}>
                            {product.sold}
                          </TableCell>
                          <TableCell 
                            align="right" 
                            sx={{ 
                              fontSize: '14px', 
                              color: product.stock < product.sold * 0.5 ? 'error.main' : 'inherit'
                            }}
                          >
                            {product.stock}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No product sales data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Sales by Category</Typography>
              {hasData && categoryData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} units`, 'Sold']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No category data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ItemsSoldAnalysis;