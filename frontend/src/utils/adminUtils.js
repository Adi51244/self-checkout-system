// Generate monthly data for the last 12 months
export const generateMonthlyData = (products) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('default', { month: 'short' });
  }).reverse();

  return months.map(month => ({
    month,
    sales: Math.floor(Math.random() * 10000) + 5000,
    revenue: Math.floor(Math.random() * 50000) + 25000,
    stock: Math.floor(Math.random() * 200) + 100,
    products: products.map(product => ({
      ...product,
      sold: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 1000) + 500,
      stockLevel: Math.floor(Math.random() * 30) + 5
    }))
  }));
};

// Get color based on stock level
export const getStockLevelColor = (stock) => {
  if (stock <= 10) return '#f44336'; // Red for low stock
  if (stock <= 20) return '#ff9800'; // Orange for medium stock
  return '#4caf50'; // Green for good stock
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Get trend percentage
export const getTrendPercentage = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

// Get product performance metrics
export const getProductPerformance = (monthlyData, productId) => {
  const performance = monthlyData.map(data => {
    const product = data.products.find(p => p.id === productId);
    return {
      month: data.month,
      sold: product.sold,
      revenue: product.revenue,
      stock: product.stockLevel
    };
  });
  return performance;
};