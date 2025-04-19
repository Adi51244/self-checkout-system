import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
} from '@mui/material';
import {
  Inventory2,
  TrendingUp,
  AttachMoney,
  ShoppingCart
} from '@mui/icons-material';
import StockAnalysis from '../components/admin/StockAnalysis';
import ItemsSoldAnalysis from '../components/admin/ItemsSoldAnalysis';
import TotalSalesAnalysis from '../components/admin/TotalSalesAnalysis';
import AverageDailySalesAnalysis from '../components/admin/AverageDailySalesAnalysis';
import { generateMonthlyData, formatCurrency } from '../utils/adminUtils';

// Mock initial products data
const mockProducts = [
  { id: 1, name: 'Apple', stock: 50, price: 0.5, sold: 150 },
  { id: 2, name: 'Banana', stock: 75, price: 0.3, sold: 200 },
  { id: 3, name: 'Orange', stock: 30, price: 0.6, sold: 120 },
  { id: 4, name: 'Milk', stock: 25, price: 2.5, sold: 80 },
  { id: 5, name: 'Bread', stock: 15, price: 1.5, sold: 90 },
];

const StatCard = ({ icon, title, value, color, onClick }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderRadius: 4,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
      }
    }}
    onClick={onClick}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${color}.light`,
        color: `${color}.main`,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [inventory, setInventory] = useState(mockProducts);
  const [openStockAnalysis, setOpenStockAnalysis] = useState(false);
  const [openItemsSoldAnalysis, setOpenItemsSoldAnalysis] = useState(false);
  const [openTotalSalesAnalysis, setOpenTotalSalesAnalysis] = useState(false);
  const [openAvgSalesAnalysis, setOpenAvgSalesAnalysis] = useState(false);

  useEffect(() => {
    setMonthlyData(generateMonthlyData(mockProducts));
  }, []);

  // Calculate statistics
  const totalStock = inventory.reduce((sum, product) => sum + product.stock, 0);
  const totalSales = inventory.reduce((sum, product) => sum + (product.sold * product.price), 0);
  const totalItems = inventory.reduce((sum, product) => sum + product.sold, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Inventory2 sx={{ fontSize: 24 }} />}
            title="Total Stock"
            value={totalStock}
            color="primary"
            onClick={() => setOpenStockAnalysis(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShoppingCart sx={{ fontSize: 24 }} />}
            title="Items Sold"
            value={totalItems}
            color="secondary"
            onClick={() => setOpenItemsSoldAnalysis(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AttachMoney sx={{ fontSize: 24 }} />}
            title="Total Sales"
            value={formatCurrency(totalSales)}
            color="success"
            onClick={() => setOpenTotalSalesAnalysis(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            title="Avg Daily Sales"
            value={formatCurrency(totalSales / 30)}
            color="info"
            onClick={() => setOpenAvgSalesAnalysis(true)}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Inventory Management
          </Typography>
          <Button variant="contained" color="primary">
            Add New Product
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Price (₹)</TableCell>
                <TableCell align="right">Sold</TableCell>
                <TableCell align="right">Revenue (₹)</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.stock}</TableCell>
                  <TableCell align="right">{product.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{product.sold}</TableCell>
                  <TableCell align="right">
                    {(product.sold * product.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Analysis Dialogs */}
      <StockAnalysis
        open={openStockAnalysis}
        onClose={() => setOpenStockAnalysis(false)}
        monthlyData={monthlyData}
        products={inventory}
      />

      <ItemsSoldAnalysis
        open={openItemsSoldAnalysis}
        onClose={() => setOpenItemsSoldAnalysis(false)}
        monthlyData={monthlyData}
      />

      <TotalSalesAnalysis
        open={openTotalSalesAnalysis}
        onClose={() => setOpenTotalSalesAnalysis(false)}
        monthlyData={monthlyData}
      />

      <AverageDailySalesAnalysis
        open={openAvgSalesAnalysis}
        onClose={() => setOpenAvgSalesAnalysis(false)}
        monthlyData={monthlyData}
      />
    </Container>
  );
};

export default AdminDashboard;