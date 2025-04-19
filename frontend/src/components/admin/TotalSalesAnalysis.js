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
  const currentMonth = monthlyData[monthlyData.length - 1] || { products: [] };
  const hasData = monthlyData.length > 0;

  // Calculate product sales ranking
  const productSalesData = currentMonth.products
    ? [...currentMonth.products]
        .sort((a, b) => (b.sold * b.price) - (a.sold * a.price))
        .map(product => ({
          name: product.name,
          revenue: product.sold * product.price,
          quantity: product.sold
        }))
    : [];

  // Calculate trend data
  const trendData = monthlyData.map(month => ({
    month: month.month,
    totalRevenue: month.products.reduce((sum, p) => sum + (p.sold * p.price), 0),
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '85vh',
          maxHeight: '90vh',
          minWidth: '98vw'  // Increased from 95vw to 98vw for maximum space
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
      <DialogContent sx={{ pb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: 450,
                display: 'flex',
                flexDirection: 'column',
                mx: -1  // Negative margin to maximize width
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue Trend Analysis
              </Typography>
              {hasData ? (
                <Box sx={{ flex: 1, width: '100%' }}>
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

          <Grid item xs={12} md={8}>  {/* Increased from md={7} to md={8} */}
            <Paper 
              elevation={0} 
              sx={{ 
                height: 450,
                display: 'flex',
                flexDirection: 'column',
                mx: -1  // Negative margin to maximize width
              }}
            >
              <Typography variant="h6" sx={{ p: 3, pb: 2, fontWeight: 600 }}>
                Best Performing Products
              </Typography>
              <TableContainer sx={{ flex: 1 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Product</TableCell>
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
                        <TableCell sx={{ fontSize: '14px' }}>{product.name}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px' }}>{product.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px' }}>{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>  {/* Decreased from md={5} to md={4} to match the 8+4 grid */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: 450,
                display: 'flex',
                flexDirection: 'column',
                mx: -1  // Negative margin to maximize width
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Revenue Distribution
              </Typography>
              {productSalesData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%' }}>
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
                        formatter={(value, name) => [formatCurrency(value), name]}
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
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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