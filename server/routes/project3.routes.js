// const express = require('express');
// const router = express.Router();

// let debts = [
//   {
//     id: 1,
//     name: "Credit Card",
//     balance: 5000,
//     interestRate: 18.9,
//     minPayment: 100
//   },
//   {
//     id: 2,
//     name: "Student Loan",
//     balance: 25000,
//     interestRate: 5.6,
//     minPayment: 200
//   }
// ];

// let nextId = 3;
// const generateId = () => nextId++;

// router.get('/debts', (req, res) => {
//   res.json(debts);
// });

// router.post('/debts', (req, res) => {
//   const { name, balance, interestRate, minPayment } = req.body;
  
//   if (!name || !balance || !interestRate || !minPayment) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   const newDebt = {
//     id: generateId(),
//     name,
//     balance: parseFloat(balance),
//     interestRate: parseFloat(interestRate),
//     minPayment: parseFloat(minPayment)
//   };

//   debts.push(newDebt);
//   res.status(201).json(newDebt);
// });

// router.delete('/debts/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   debts = debts.filter(debt => debt.id !== id);
//   res.json({ message: "Debt deleted successfully" });
// });

// router.post('/calculate', (req, res) => {
//   try {
//     const { debts: inputDebts, strategy, monthlyPayment } = req.body;
//     const payoffPlan = calculateDebtPayoff(inputDebts, strategy, monthlyPayment);
//     res.json(payoffPlan);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// function calculateDebtPayoff(debts, strategy, monthlyPayment) {
//   // ... (keep all your payoff calculation logic from original)
//   const sortedDebts = [...debts].map(debt => ({
//     ...debt,
//     balance: parseFloat(debt.balance),
//     interestRate: parseFloat(debt.interestRate),
//     minPayment: parseFloat(debt.minPayment)
//   }));

//   if (strategy === 'avalanche') {
//     sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
//   } else {
//     sortedDebts.sort((a, b) => a.balance - b.balance);
//   }

//   const payoffPlan = [];
//   let remainingDebts = sortedDebts.map(debt => ({ ...debt }));
//   let month = 1;

//   while (remainingDebts.length > 0 && month < 120) {
//     const monthResult = {
//       month,
//       payments: [],
//       interestPaid: 0,
//       remainingDebt: 0
//     };

//     let remainingPayment = monthlyPayment;
    
//     // Pay minimums first
//     remainingDebts.forEach(debt => {
//       const payment = Math.min(debt.minPayment, debt.balance);
//       monthResult.payments.push({
//         debtName: debt.name,
//         amount: payment,
//         paidOff: false
//       });
//       remainingPayment -= payment;
//     });

//     // Apply extra to priority debt
//     if (remainingPayment > 0 && remainingDebts.length > 0) {
//       const priorityDebt = remainingDebts[0];
//       const extraPayment = Math.min(remainingPayment, priorityDebt.balance - priorityDebt.minPayment);
//       if (extraPayment > 0) {
//         monthResult.payments[0].amount += extraPayment;
//         remainingPayment -= extraPayment;
//       }
//     }

//     // Apply payments and interest
//     remainingDebts.forEach((debt, index) => {
//       const payment = monthResult.payments[index].amount;
//       const monthlyInterest = (debt.balance * debt.interestRate / 100) / 12;
      
//       debt.balance = debt.balance + monthlyInterest - payment;
//       monthResult.interestPaid += monthlyInterest;

//       if (debt.balance <= 0.01) {
//         monthResult.payments[index].paidOff = true;
//         debt.balance = 0;
//       }
//     });

//     remainingDebts = remainingDebts.filter(debt => debt.balance > 0.01);
//     monthResult.remainingDebt = remainingDebts.reduce((sum, debt) => sum + debt.balance, 0);
//     payoffPlan.push(monthResult);
//     month++;
//   }

//   return payoffPlan;
// }

// module.exports = router;

const express = require('express');
const router = express.Router();

// Function to calculate the payoff plan (Snowball method)
function calculatePayoffPlan(debts, extraPayment) {
    // Process debts with validation
    let processedDebts = debts.map(debt => ({
        name: debt.name,
        balance: parseFloat(debt.balance),
        rate: parseFloat(debt.interestRate) / 100 / 12, // Monthly rate
        minPayment: parseFloat(debt.minPayment),
        paid: 0,
        interestPaid: 0
    }));

    // Sort debts by balance (Snowball method)
    processedDebts = processedDebts.sort((a, b) => a.balance - b.balance);

    let months = 0;
    let totalInterest = 0;
    const payoffPlan = [];
    const monthlyPayment = extraPayment;

    while (processedDebts.length > 0 && months < 360) { // 30-year timeout
        months++;
        let monthlyReport = {
            month: months,
            focusDebt: processedDebts[0].name,
            payments: [],
            remaining: 0
        };

        // Track available extra payment
        let extra = monthlyPayment;

        // Process each debt
        for (const debt of processedDebts) {
            // Calculate interest
            const interest = debt.balance * debt.rate;
            totalInterest += interest;
            debt.interestPaid += interest;
            debt.balance += interest;

            // Make minimum payment
            const minPayment = Math.min(debt.balance, debt.minPayment);
            debt.balance -= minPayment;
            debt.paid += minPayment;

            // Store payment info
            monthlyReport.payments.push({
                name: debt.name,
                paid: minPayment,
                interest: interest
            });
        }

        // Apply extra payments to first debt
        if (processedDebts.length > 0 && extra > 0) {
            const focusDebt = processedDebts[0];
            const payment = Math.min(focusDebt.balance, extra);
            focusDebt.balance -= payment;
            focusDebt.paid += payment;
            extra -= payment;

            monthlyReport.payments[0].paid += payment;
        }

        // Update remaining balances and filter paid debts
        processedDebts = processedDebts.filter(d => d.balance > 0.01);
        monthlyReport.remaining = processedDebts.reduce((sum, d) => sum + d.balance, 0);

        payoffPlan.push(monthlyReport);
    }

    return { payoffPlan, totalInterest };
}

// Route to calculate the payoff plan
router.post('/calculate', (req, res) => {
    try {
        const { debts, extraPayment } = req.body;

        if (!debts || !Array.isArray(debts) || debts.length === 0) {
            return res.status(400).json({ error: 'Debts are required and must be a non-empty array.' });
        }

        if (extraPayment === undefined || extraPayment === null || typeof extraPayment !== 'number') {
            return res.status(400).json({ error: 'Extra payment is required and must be a number.' });
        }

        const { payoffPlan, totalInterest } = calculatePayoffPlan(debts, extraPayment);

        res.json({ payoffPlan, totalInterest });
    } catch (error) {
        console.error("Error calculating payoff plan:", error);
        res.status(500).json({ error: 'Failed to calculate payoff plan' });
    }
});

module.exports = router;
