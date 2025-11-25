import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography, Grid } from '@mui/material';
import ProjectCard from './components/ProjectCards/ProjectCard';
import PurchaseAnalyzer from './components/PurchaseAnalyzer/PurchaseAnalyzer';
import InvestmentComparator from './components/InvestmentComparator/InvestmentComparator';
import DebtManagerChat from './components/DebtManager/DebtManagerChat';
import CryptoTracker from './components/CryptoTracker/CryptoTracker';
import FinancialTipCard from './components/FinancialTips/FinancialTips';

const projects = [
  {
    title: 'Purchase Analyzer',
    description: 'Determine if a purchase fits within your budget',
    path: '/purchase-analyzer',
    color: '#4e79a7'
  },
  {
    title: 'Investment Comparator',
    description: 'Compare different investment strategies',
    path: '/investment-comparator',
    color: '#f28e2b'
  },
  {
    title: 'Debt Manager',
    description: 'Create and manage debt payoff plans',
    path: '/debt-manager',
    color: '#e15759'
  },
  {
    title: 'Crypto Tracker',
    description: 'Get real-time cryptocurrency data',
    path: '/crypto-tracker',
    color: '#76b7b2'
  }
];

function App() {
  return (
    <Router>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: '100vh',
          position: 'relative',
          pb: 10
        }}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h3" align="center" gutterBottom>
                  Financial Tools Dashboard
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
                  Select a financial tool to get started
                </Typography>
                <Grid container spacing={4}>
                  {projects.map((project) => (
                    <Grid item xs={12} sm={6} key={project.title}>
                      <ProjectCard 
                        title={project.title}
                        description={project.description}
                        path={project.path}
                        color={project.color}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Container>
            } 
          />
          
          {/* Fixed route paths to match the project paths */}
          <Route path="/purchase-analyzer" element={<PurchaseAnalyzer />} />
          <Route path="/investment-comparator" element={<InvestmentComparator />} />
          <Route path="/debt-manager" element={<DebtManagerChat />} />
          <Route path="/crypto-tracker" element={<CryptoTracker />} />
          
          {/* Optional: Add a 404 route for unmatched paths */}
          <Route path="*" element={
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h4">404 - Page Not Found</Typography>
            </Container>
          } />
        </Routes>

        <FinancialTipCard />
      </Container>
    </Router>
  );
}

export default App;