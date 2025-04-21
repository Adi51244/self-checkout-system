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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/adminUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SalesAnalysis = ({ open, onClose, monthlyData = [] }) => {
  const currentMonth = monthlyData[monthlyData.length - 1] || { products: [] };
  const hasData = monthlyData.length > 0;
  
  const topProducts = currentMonth.products
    ? [...currentMonth.products]
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
        .map(product => ({
          name: product.name,
          id: product.id,
          sku: product.sku || '',
          category: product.category || 'Uncategorized',
          price: product.price,
          description: product.description || '',
          value: product.sold
        }))
    : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Sales Analysis Dashboard
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Monthly Sales and Revenue Trends</Typography>
            <Paper elevation={0} sx={{ p: 2, height: 400 }}>
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Revenue') return formatCurrency(value);
                        return value;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      name="Sales Volume"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#82ca9d"
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">No sales data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
            <Paper elevation={0} sx={{ p: 2, height: 400 }}>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProducts}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, value}) => `${name.substring(0, 12)}${name.length > 12 ? '...' : ''} (${value})`}
                    >
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        const product = topProducts.find(p => p.name === name);
                        return [
                          <div>
                            <div style={{marginBottom: '4px'}}><strong>Quantity Sold: {value}</strong></div>
                            {product && product.sku && <div style={{fontSize: '12px'}}>SKU: {product.sku}</div>}
                            {product && product.category && <div style={{fontSize: '12px'}}>Category: {product.category}</div>}
                            {product && product.price && <div style={{fontSize: '12px'}}>Unit Price: {formatCurrency(product.price)}</div>}
                            {product && product.description && (
                              <div style={{fontSize: '12px', maxWidth: '200px'}}>
                                Description: {product.description.length > 30 ? `${product.description.substring(0, 30)}...` : product.description}
                              </div>
                            )}
                          </div>,
                          product ? product.name : name
                        ];
                      }}
                      contentStyle={{ 
                        borderRadius: 8,
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        padding: '10px 14px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">No product data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Monthly Sales Distribution</Typography>
            <Paper elevation={0} sx={{ p: 2, height: 400 }}>
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                    <Bar dataKey="stock" fill="#82ca9d" name="Stock Level" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">No sales distribution data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SalesAnalysis;