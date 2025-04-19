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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { formatCurrency } from '../../utils/adminUtils';

const DAYS_IN_MONTH = 30;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AverageDailySalesAnalysis = ({ open, onClose, monthlyData = [] }) => {
  const currentMonth = monthlyData[monthlyData.length - 1] || { products: [] };
  const hasData = monthlyData.length > 0;

  // Calculate daily averages per product
  const productDailyAverages = currentMonth.products
    ? [...currentMonth.products]
        .map(product => ({
          name: product.name,
          averageDailySales: product.sold / DAYS_IN_MONTH,
          averageRevenue: (product.sold * product.price) / DAYS_IN_MONTH,
        }))
        .sort((a, b) => b.averageRevenue - a.averageRevenue)
    : [];

  // Simulate weekly pattern data (example pattern - more sales on weekends)
  const weeklyPatternData = WEEKDAYS.map(day => ({
    day,
    averageSales: currentMonth.sales ? 
      (currentMonth.sales / DAYS_IN_MONTH) * (day === 'Sat' || day === 'Sun' ? 1.5 : 1) : 0,
    averageRevenue: currentMonth.revenue ? 
      (currentMonth.revenue / DAYS_IN_MONTH) * (day === 'Sat' || day === 'Sun' ? 1.5 : 1) : 0,
  }));

  // Calculate hourly distribution (simulated data - peak hours pattern)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const isPeakHour = hour >= 11 && hour <= 14 || hour >= 17 && hour <= 20;
    const baseValue = currentMonth.sales ? currentMonth.sales / (DAYS_IN_MONTH * 24) : 0;
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sales: baseValue * (isPeakHour ? 2 : 1),
      revenue: (baseValue * (isPeakHour ? 2 : 1)) * (currentMonth.revenue / currentMonth.sales || 0),
    };
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '90vh',
          maxHeight: '90vh',
          minWidth: '98vw'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'black' }}>
            Average Daily Sales Analysis
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pb: 4, height: 'calc(90vh - 100px)' }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} md={6} sx={{ height: '50%' }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'black' }}>
                Weekly Sales Pattern
              </Typography>
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyPatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageSales" name="Avg. Sales" fill="#8884d8" />
                    <Bar dataKey="averageRevenue" name="Avg. Revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                  <Typography variant="body1" color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8} sx={{ height: '33%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                mx: -1
              }}
            >
              <Typography variant="h6" sx={{ p: 3, pb: 2, fontWeight: 600 }}>
                Daily Product Performance
              </Typography>
              <TableContainer sx={{ flex: 1 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Product</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Avg Daily Units</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Avg Daily Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productDailyAverages.map((product, index) => (
                      <TableRow 
                        key={product.name}
                        sx={{ 
                          bgcolor: index < 3 ? `rgba(130, 202, 157, ${0.1 - index * 0.02})` : 'inherit',
                          '&:hover': {
                            bgcolor: index < 3 ? `rgba(130, 202, 157, ${0.2 - index * 0.05})` : 'rgba(0,0,0,0.04)'
                          }
                        }}
                      >
                        <TableCell sx={{ 
                          fontSize: '14px', 
                          maxWidth: 200, 
                          whiteSpace: 'normal', 
                          wordBreak: 'break-word'
                        }}>
                          {product.name}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px', fontWeight: index < 3 ? 600 : 400 }}>
                          {product.averageDailySales.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '14px', fontWeight: index < 3 ? 600 : 400 }}>
                          {formatCurrency(product.averageRevenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} sx={{ height: '33%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                mx: -1
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Hourly Sales Distribution
              </Typography>
              {hasData ? (
                <Box sx={{ flex: 1, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={hourlyData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour"
                        tick={{ 
                          fill: '#666',
                          fontSize: 12 
                        }}
                        interval={2}
                        height={50}
                        tickMargin={10}
                      />
                      <YAxis 
                        yAxisId="left"
                        tick={{ 
                          fill: '#666',
                          fontSize: 12 
                        }}
                        width={60}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ 
                          fill: '#666',
                          fontSize: 12 
                        }}
                        width={80}
                        tickFormatter={(value) => `₹${value/1000}K`}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Average Revenue') return [formatCurrency(value), name];
                          return [`${value.toFixed(1)} units`, name];
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
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '14px'
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Average Sales"
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Average Revenue"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No hourly distribution data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AverageDailySalesAnalysis;