const express = require('express');
const router = express.Router();

const investmentDomains = {
  gold: { 
    name: "Gold",
    avgReturn: 0.08, 
    volatility: 0.15, 
    minDuration: 1,
    description: "Traditional safe-haven asset with steady returns"
  },
  realEstate: { 
    name: "Real Estate",
    avgReturn: 0.10, 
    volatility: 0.20, 
    minDuration: 5,
    description: "Property investment with appreciation and rental income potential"
  },
  stock: { 
    name: "Stocks",
    avgReturn: 0.12, 
    volatility: 0.25, 
    minDuration: 3,
    description: "Equity investments in publicly traded companies"
  },
  mutualFunds: { 
    name: "Mutual Funds",
    avgReturn: 0.11, 
    volatility: 0.18, 
    minDuration: 3,
    description: "Diversified portfolio managed by professionals"
  },
  crypto: { 
    name: "Cryptocurrency",
    avgReturn: 0.25, 
    volatility: 0.80, 
    minDuration: 5,
    description: "Digital assets with high growth potential and risk"
  },
  bonds: { 
    name: "Government Bonds",
    avgReturn: 0.06, 
    volatility: 0.05, 
    minDuration: 1,
    description: "Low-risk fixed income securities"
  },
  fd: { 
    name: "Fixed Deposit",
    avgReturn: 0.07, 
    volatility: 0.01, 
    minDuration: 1,
    description: "Bank deposits with guaranteed returns"
  }
};

router.get('/investment-options', (req, res) => {
  const options = Object.keys(investmentDomains).map(key => ({
    value: key,
    label: investmentDomains[key].name,
    description: investmentDomains[key].description
  }));
  res.json(options);
});

router.post('/compare-investments', (req, res) => {
  const { amount, years, domain1, domain2 } = req.body;
  
 // Validation
 if (!investmentDomains[domain1] || !investmentDomains[domain2]) {
    return res.status(400).json({ error: 'Invalid investment domains selected' });
  }

  if (years < 1) {
    return res.status(400).json({ error: 'Investment duration must be at least 1 year' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Investment amount must be positive' });
  }

  // Check minimum duration requirements
  const domain1Min = investmentDomains[domain1].minDuration;
  const domain2Min = investmentDomains[domain2].minDuration;
  
  if (years < domain1Min || years < domain2Min) {
    return res.status(400).json({ 
      error: `Minimum investment duration not met. ${investmentDomains[domain1].name} requires ${domain1Min} years, ${investmentDomains[domain2].name} requires ${domain2Min} years.` 
    });
  }


  const calculateProjection = (domain) => {
    const { avgReturn, volatility } = investmentDomains[domain];
    const baseReturn = amount * Math.pow(1 + avgReturn, years);
    const variation = baseReturn * volatility * (Math.random() - 0.5);
    return Math.max(amount, baseReturn + variation);
  };

  const projection1 = calculateProjection(domain1);
  const projection2 = calculateProjection(domain2);

  res.json({
    domain1: {
      ...investmentDomains[domain1],
      projection: projection1,
      recommended: projection1 > projection2
    },
    domain2: {
      ...investmentDomains[domain2],
      projection: projection2,
      recommended: projection2 > projection1
    },
    amount,
    years,
    difference: Math.abs(projection1 - projection2),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;