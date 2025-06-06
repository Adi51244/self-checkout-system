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

// Mock initial products data based on actual backend products
const mockProducts = [
  // Complan Products
  { id: 1, name: "Complan Classic Creme", category: "Complan", stock: 32, price: 290, sold: 78 },
  { id: 2, name: "Complan Kesar Badam", category: "Complan", stock: 28, price: 310, sold: 65 },
  { id: 3, name: "Complan Nutrigro Badam Kheer", category: "Complan", stock: 15, price: 325, sold: 42 },
  { id: 4, name: "Complan Pista Badam", category: "Complan", stock: 22, price: 310, sold: 56 },
  { id: 5, name: "Complan Royal Chocolate", category: "Complan", stock: 30, price: 290, sold: 81 },
  
  // Dermi Cool Products
  { id: 6, name: "Dermi Cool", category: "Personal Care", stock: 80, price: 55, sold: 120 },
  
  // Everyuth Products
  { id: 7, name: "EY AAAM TULSI TURMERIC FACEWASH50G", category: "Facewash", stock: 45, price: 85, sold: 93 },
  { id: 8, name: "EY ADVANCED GOLDEN GLOW PEEL OFF M- 50G", category: "Skincare", stock: 38, price: 145, sold: 62 },
  { id: 9, name: "EY NATURALS NEEM FACE WASH AY 50G", category: "Facewash", stock: 52, price: 85, sold: 104 },
  
  // Gatsby Products
  { id: 10, name: "Gatsby Deo Shield", category: "Personal Care", stock: 42, price: 199, sold: 76 },
  
  // Glucon-D Products
  { id: 11, name: "Glucon D Nimbu Pani 1-KG", category: "Beverages", stock: 35, price: 210, sold: 89 },
  { id: 12, name: "Glucon D Regular 1-KG", category: "Beverages", stock: 48, price: 195, sold: 115 },
  { id: 13, name: "Glucon D Regular 2-KG", category: "Beverages", stock: 25, price: 380, sold: 53 },
  { id: 14, name: "Glucon D Tangy orange 1-KG", category: "Beverages", stock: 32, price: 210, sold: 78 },
  
  // Lux Products
  { id: 15, name: "Lux Purple", category: "Personal Care", stock: 95, price: 45, sold: 142 },
  
  // Nutralite Products
  { id: 16, name: "Nutralite ACHARI MAYO 300g-275g-25g-", category: "Condiments", stock: 28, price: 135, sold: 65 },
  { id: 17, name: "Nutralite CHEESY GARLIC MAYO 300g-275g-25g-", category: "Condiments", stock: 35, price: 145, sold: 83 },
  { id: 18, name: "Nutralite DOODHSHAKTHI PURE GHEE 1L", category: "Dairy", stock: 18, price: 599, sold: 32 },
  
  // Nycil Products
  { id: 19, name: "Nycil Prickly Heat Powder", category: "Personal Care", stock: 50, price: 85, sold: 98 },
  
  // Sugar Free Products
  { id: 20, name: "SUGAR FREE GOLD 500 PELLET", category: "Sweeteners", stock: 22, price: 295, sold: 45 },
  { id: 21, name: "SUGAR FREE NATURA 500 PELLET", category: "Sweeteners", stock: 26, price: 275, sold: 58 },
  { id: 22, name: "SUGARLITE POUCH 500G", category: "Sweeteners", stock: 40, price: 155, sold: 72 }
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