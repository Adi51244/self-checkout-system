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
  // Check if monthlyData exists and has length
  const hasData = monthlyData && monthlyData.length > 0;
  
  // Use safe fallback for currentMonth
  const currentMonth = hasData ? monthlyData[monthlyData.length - 1] : { products: [] };

  // Calculate daily averages per product
  const productDailyAverages = (currentMonth.products || [])
    .map(product => ({
      name: product.name || 'Unknown Product',
      averageDailySales: (product.sold || 0) / DAYS_IN_MONTH,
      averageRevenue: ((product.revenue || (product.sold * product.price) || 0)) / DAYS_IN_MONTH,
    }))
    .sort((a, b) => b.averageRevenue - a.averageRevenue);

  // Improved weekly pattern data calculation with fallbacks
  const weeklyPatternData = WEEKDAYS.map(day => {
    const salesValue = currentMonth.sales || 
      (currentMonth.products || []).reduce((sum, p) => sum + (p.sold || 0), 0);
    const revenueValue = currentMonth.revenue || 
      (currentMonth.products || []).reduce((sum, p) => sum + (p.revenue || (p.sold * p.price) || 0), 0);
    
    const isWeekend = day === 'Sat' || day === 'Sun';
    const weekendMultiplier = isWeekend ? 1.5 : 1;
    
    return {
      day,
      averageSales: (salesValue / DAYS_IN_MONTH) * weekendMultiplier,
      averageRevenue: (revenueValue / DAYS_IN_MONTH) * weekendMultiplier,
    };
  });

  // Improved hourly distribution calculation with fallbacks
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const isPeakHour = (hour >= 11 && hour <= 14) || (hour >= 17 && hour <= 20);
    const peakMultiplier = isPeakHour ? 2 : 1;
    
    // Calculate base values safely
    const salesValue = currentMonth.sales || 
      (currentMonth.products || []).reduce((sum, p) => sum + (p.sold || 0), 0);
    const revenueValue = currentMonth.revenue || 
      (currentMonth.products || []).reduce((sum, p) => sum + (p.revenue || (p.sold * p.price) || 0), 0);
    
    const baseSales = salesValue / (DAYS_IN_MONTH * 24);
    const avgUnitPrice = salesValue > 0 ? revenueValue / salesValue : 0;
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sales: baseSales * peakMultiplier,
      revenue: (baseSales * peakMultiplier) * avgUnitPrice,
    };
  });

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
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Average Daily Sales Analysis</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Weekly Sales Pattern</Typography>
              {hasData && weeklyPatternData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyPatternData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" fontSize={14} />
                      <YAxis fontSize={14} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === "Avg. Revenue") return [formatCurrency(value), name];
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
                      <Legend wrapperStyle={{ fontSize: '16px', paddingTop: '10px' }} />
                      <Bar dataKey="averageSales" name="Avg. Sales" fill="#8884d8" barSize={60} />
                      <Bar dataKey="averageRevenue" name="Avg. Revenue" fill="#82ca9d" barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                  <Typography variant="body1" color="text.secondary">No weekly pattern data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Daily Product Performance</Typography>
              {productDailyAverages.length > 0 ? (
                <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <Table stickyHeader size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>Product</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '16px' }}>Avg Daily Units</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '16px' }}>Avg Daily Revenue</TableCell>
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
                            fontSize: '16px', 
                            maxWidth: 400, 
                            whiteSpace: 'normal', 
                            wordBreak: 'break-word'
                          }}>
                            {product.name}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '16px', fontWeight: index < 3 ? 600 : 400 }}>
                            {product.averageDailySales.toFixed(2)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '16px', fontWeight: index < 3 ? 600 : 400 }}>
                            {formatCurrency(product.averageRevenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No product performance data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Hourly Sales Distribution</Typography>
              {hasData && hourlyData.length > 0 ? (
                <Box sx={{ flex: 1, width: '100%', height: '90%' }}>
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
                          fontSize: 14
                        }}
                        interval={1}
                        height={50}
                        tickMargin={10}
                      />
                      <YAxis 
                        yAxisId="left"
                        tick={{ 
                          fill: '#666',
                          fontSize: 14 
                        }}
                        width={60}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ 
                          fill: '#666',
                          fontSize: 14
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
                          fontSize: '16px'
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        strokeWidth={3}
                        name="Average Sales"
                        dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        strokeWidth={3}
                        name="Average Revenue"
                        dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 4 }}
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