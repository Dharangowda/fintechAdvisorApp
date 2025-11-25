import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Select, MenuItem, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Alert, CircularProgress, Grid, Card, CardContent
} from '@mui/material';

const InvestmentComparator = () => {
  const [formData, setFormData] = useState({
    amount: '',
    years: '',
    domain1: 'gold',
    domain2: 'stock'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const investmentOptions = [
    { value: 'gold', label: 'Gold' },
    { value: 'realEstate', label: 'Real Estate' },
    { value: 'stock', label: 'Stocks' },
    { value: 'mutualFunds', label: 'Mutual Funds' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'bonds', label: 'Government Bonds' },
    { value: 'fd', label: 'Fixed Deposit' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/investment-comparator/compare-investments', {
        amount: parseFloat(formData.amount),
        years: parseInt(formData.years),
        domain1: formData.domain1,
        domain2: formData.domain2
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compare investments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Investment Domain Comparison</Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Investment Amount ($)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Investment Duration (Years)"
                name="years"
                type="number"
                value={formData.years}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                label="First Investment Option"
                name="domain1"
                value={formData.domain1}
                onChange={handleChange}
                required
              >
                {investmentOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                label="Second Investment Option"
                name="domain2"
                value={formData.domain2}
                onChange={handleChange}
                required
              >
                {investmentOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Compare Investments'}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </Paper>

      {result && (
        <Box>
          <Typography variant="h6" gutterBottom>Comparison Results</Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ 
                borderColor: result.domain1.recommended ? 'success.main' : 'divider',
                borderWidth: 2
              }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {result.domain1.name.toUpperCase()}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    Projected Value: ${result.domain1.projection.toFixed(2)}
                  </Typography>
                  <Typography>Avg. Return: {(result.domain1.avgReturn * 100).toFixed(1)}%</Typography>
                  {result.domain1.recommended && (
                    <Typography color="success.main" sx={{ mt: 1 }}>
                      ★ Better choice for your investment
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ 
                borderColor: result.domain2.recommended ? 'success.main' : 'divider',
                borderWidth: 2
              }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {result.domain2.name.toUpperCase()}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    Projected Value: ${result.domain2.projection.toFixed(2)}
                  </Typography>
                  <Typography>Avg. Return: {(result.domain2.avgReturn * 100).toFixed(1)}%</Typography>
                  {result.domain2.recommended && (
                    <Typography color="success.main" sx={{ mt: 1 }}>
                      ★ Better choice for your investment
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Initial Investment</strong></TableCell>
                  <TableCell>${result.amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Investment Duration</strong></TableCell>
                  <TableCell>{result.years} years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Value Difference</strong></TableCell>
                  <TableCell>${result.difference.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ mt: 2 }}>
            Note: These projections are based on historical averages and simulated market conditions. 
            Past performance is not indicative of future results.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default InvestmentComparator;