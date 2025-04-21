import React from 'react';
import { Dialog, DialogTitle, DialogContent, Grid, Paper, Typography, IconButton, TableContainer, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DailySalesAnalysis = ({ open, onClose }) => {
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
          <Typography variant="h5">Average Daily Sales Analysis</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom>Daily Sales Trends</Typography>
              {/* Add your chart or content for Daily Sales Trends here */}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, height: 500 }}>
              <Typography variant="h6" gutterBottom>Daily Performance Metrics</Typography>
              {/* Add your chart or content for Daily Performance Metrics here */}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Daily Sales Details</Typography>
              <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
                {/* Add your table or content for Daily Sales Details here */}
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DailySalesAnalysis;