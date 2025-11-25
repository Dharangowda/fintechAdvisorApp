import React, { useState } from 'react';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  Typography, 
  Paper,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert
} from '@mui/material';

const PurchaseAnalyzer = () => {
  const [formData, setFormData] = useState({
    income: '',
    purchaseType: 'car',
    cost: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/purchase-analyzer/analyze', {
        income: parseFloat(formData.income),
        purchaseType: formData.purchaseType,
        cost: parseFloat(formData.cost)
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Financial Purchase Advisor
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Annual Income ($)"
            name="income"
            type="number"
            value={formData.income}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          
          <Select
            fullWidth
            label="Purchase Type"
            name="purchaseType"
            value={formData.purchaseType}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="car">Car</MenuItem>
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="education">Education</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          
          <TextField
            fullWidth
            label="Cost ($)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Purchase'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Purchase Analysis
            </Typography>
            
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Affordability</strong></TableCell>
                    <TableCell>
                      {result.affordable ? (
                        <Typography color="success.main">✅ Affordable</Typography>
                      ) : (
                        <Typography color="error.main">❌ Not Affordable</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Recommendation</strong></TableCell>
                    <TableCell>{result.message}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Interest Rate</strong></TableCell>
                    <TableCell>{result.interestRate}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Estimated Monthly Payment</strong></TableCell>
                    <TableCell>${result.monthlyPayment.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {!result.affordable && (
              <Alert severity="warning">
                Consider saving more or looking for less expensive options. 
                The recommended maximum is 30% of your annual income (${(formData.income * 0.3).toFixed(2)}).
              </Alert>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PurchaseAnalyzer;