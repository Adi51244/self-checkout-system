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
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatCurrency } from '../../utils/adminUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TotalSalesAnalysis = ({ open, onClose, monthlyData = [] }) => {
  // Check if monthlyData exists and has length
  const hasData = monthlyData && monthlyData.length > 0;
  
  // Use optional chaining to safely access data
  const currentMonth = hasData ? monthlyData[monthlyData.length - 1] : { products: [] };
  
  // Ensure products is always an array and handle missing properties gracefully
  const productSalesData = (currentMonth.products || []).map(product => ({
    name: product.name || 'Unknown Product',
    id: product.id || '',
    sku: product.sku || '',
    category: product.category || 'Uncategorized',
    price: product.price || 0,
    description: product.description || '',
    // Use product.revenue directly if it exists, otherwise calculate it
    revenue: product.revenue || (product.sold * product.price) || 0,
    quantity: product.sold || 0
  })).sort((a, b) => b.revenue - a.revenue);

  // Calculate trend data
  const trendData = hasData ? monthlyData.map(month => ({
    month: month.month,
    // Use the month.revenue directly if it exists, otherwise calculate it
    totalRevenue: month.revenue || (month.products || []).reduce((sum, p) => sum + (p.revenue || (p.sold * p.price) || 0), 0),
  })) : [];

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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Total Sales Analysis
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue Trend Analysis
              </Typography>
              {hasData && trendData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        padding={{ left: 30, right: 30 }}
                        tick={{ fontSize: 12, fill: '#666' }}
                        height={60}
                        tickMargin={20}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis 
                        tickFormatter={(value) => `₹${value/1000}K`}
                        tick={{ fontSize: 12, fill: '#666' }}
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: '#666', fontWeight: 600 }}
                        contentStyle={{ 
                          borderRadius: 8,
                          border: 'none',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          padding: '10px 14px',
                          fontSize: '14px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Total Revenue"
                        strokeWidth={2}
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px'
                        }}
                        formatter={(value) => <span style={{ color: '#666', fontSize: '14px' }}>{value}</span>}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No revenue data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Best Performing Products
              </Typography>
              {productSalesData.length > 0 ? (
              <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Product Details</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Units Sold</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productSalesData.map((product, index) => (
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
                        <TableCell sx={{ fontSize: '14px' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {product.sku && `SKU: ${product.sku} | `}Category: {product.category}
                            </Typography>
                            {product.description && (
                              <Typography variant="caption" color="text.secondary" sx={{display: 'block', maxWidth: 250}} noWrap>
                                {product.description.length > 40 ? `${product.description.substring(0, 40)}...` : product.description}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px' }}>{formatCurrency(product.price)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px' }}>{product.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px' }}>{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No product sales data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue Distribution
              </Typography>
              {productSalesData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productSalesData.slice(0, 5)}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius="55%"
                        outerRadius="75%"
                        paddingAngle={2}
                        label={({ name, value }) => (
                          `${name.length > 15 ? name.substring(0, 15) + '...' : name}`
                        )}
                        labelLine={{ strokeWidth: 1, stroke: '#666' }}
                      >
                        {productSalesData.slice(0, 5).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const product = productSalesData.find(p => p.name === name);
                          return [
                            <div>
                              <div style={{marginBottom: '4px'}}><strong>{formatCurrency(value)}</strong></div>
                              {product && product.sku && <div style={{fontSize: '12px'}}>SKU: {product.sku}</div>}
                              {product && product.category && <div style={{fontSize: '12px'}}>Category: {product.category}</div>}
                              {product && product.price && <div style={{fontSize: '12px'}}>Unit Price: {formatCurrency(product.price)}</div>}
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
                      <Legend 
                        verticalAlign="bottom"
                        align="center"
                        layout="horizontal"
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '14px'
                        }}
                        formatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No revenue distribution data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default TotalSalesAnalysis;