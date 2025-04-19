// ...existing imports...

const LineChart = ({ data, options }) => {
  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Line
        data={data}
        options={{
          ...options,
          maintainAspectRatio: false,
          responsive: true,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default LineChart;