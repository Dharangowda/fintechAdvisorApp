const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock function (Replace with Intrinio API if needed)
const checkLoanRates = async (purchaseType) => {
  if (purchaseType === 'car') return 5.0;
  if (purchaseType === 'house') return 3.5;
  return 4.0;
};

router.post('/analyze', async (req, res) => {
  const { income, purchaseType, cost } = req.body;

  const maxAffordable = income * 0.3;
  const affordable = cost <= maxAffordable;
  const interestRate = await checkLoanRates(purchaseType);
  const loanTermYears = purchaseType === 'house' ? 30 : 5;
  const monthlyPayment = (cost * (1 + interestRate / 100)) / (loanTermYears * 12);

  res.json({
    affordable,
    message: affordable
      ? `This purchase is within your budget. Estimated monthly payment: $${monthlyPayment.toFixed(2)}`
      : `This purchase exceeds 30% of your income. Consider saving more or finding a cheaper option.`,
    interestRate,
    monthlyPayment,
  });
});

module.exports = router;