import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const tips = [
  {
    title: " Start an Emergency Fund",
    content: "...Create a savings buffer that covers at least 3 months of your essential living expenses...",
    type: "Saving Tip"
  },
  {
    title: "Start an Emergency Fund",
    content: "...Create a savings buffer that covers at least 3 months of your essential living expenses...",
    type: "Saving Tip"
  },
  {
    title: "Pay Yourself First",
    content: "....Before you spend anything from your income, set aside a portion for savings...",
    type: "Saving Tip"
  },
  {
    title: "Track Every Expense",
    content: "...Maintain a daily or weekly log of where your money goes...",
    type: "Saving Tip"
  },
  {
    title: "Avoid Lifestyle Inflation",
    content: "...As your income increases, resist the urge to spend more...",
    type: "Saving Tip"
  },
  {
    title: "Create a Realistic Budget",
    content: "...Make a monthly budget that allocates funds to savings, bills, food, and fun...",
    type: "Saving Tip"
  },
  {
    title: "Use Cash for Discretionary Spending",
    content: "...Withdraw a fixed amount for fun spending...",
    type: "Saving Tip"
  },
  {
    title: "Use the 50/30/20 Rule",
    content: "...Divide your income into 50% needs, 30% wants, and 20% savings...",
    type: "Saving Tip"
  },
  {
    title: "Set SMART Financial Goals",
    content: "...Make your financial goals Specific, Measurable, Achievable...",
    type: "Saving Tip"
  },
  {
    title: "Automate Your Savings",
    content: "...Set up automatic transfers from your checking to savings account...",
    type: "Saving Tip"
  },
  {
    title: "Use a Separate Account for Savings",
    content: "...Keep your savings in a separate bank account that’s not easily accessible...",
    type: "Saving Tip"
  },

  // INVESTING TIPS
  {
    title: "Start Investing Early",
    content: "...The earlier you start, the more time your money has to grow through compounding...",
    type: "Investing Tip"
  },
  {
    title: "Understand Compound Interest",
    content: "...Start investing early. Compound interest helps your money grow exponentially...",
    type: "Investing Tip"
  },
  {
    title: "Diversify Your Investments",
    content: "...Never put all your money into one investment...",
    type: "Investing Tip"
  },
  {
    title: "Invest Consistently",
    content: "...Invest a fixed amount every month regardless of market conditions...",
    type: "Investing Tip"
  },
  {
    title: "Avoid Timing the Market",
    content: "...Don’t try to predict market highs and lows...",
    type: "Investing Tip"
  },
  {
    title: "Understand Your Risk Tolerance",
    content: "...Know how much risk you’re comfortable with...",
    type: "Investing Tip"
  },
  {
    title: "Use Low-Cost Index Funds",
    content: "...Index funds track the market and charge very low fees...",
    type: "Investing Tip"
  },
  {
    title: "Reinvest Dividends",
    content: "...Choose to reinvest any dividends you earn rather than cashing them out...",
    type: "Investing Tip"
  },
  {
    title: "Invest in What You Understand",
    content: "...Don’t invest in complex products you don’t understand...",
    type: "Investing Tip"
  },
  {
    title: "Review Your Portfolio Annually",
    content: "...Check your investments once a year. Rebalance if necessary...",
    type: "Investing Tip"
  },

  // DEBT MANAGEMENT TIPS
  {
    title: "Limit Credit Card Usage",
    content: "...Use credit cards for planned purchases only and pay the full balance...",
    type: "Debt Management Tip"
  },
  {
    title: "Know Your Interest Rates",
    content: "...Make a list of all your debts and their interest rates...",
    type: "Debt Management Tip"
  },
  {
    title: "Avoid Minimum Payments",
    content: "...Pay more than the minimum on credit cards...",
    type: "Debt Management Tip"
  },
  {
    title: "Use the Snowball Method",
    content: "...Pay off your smallest debt first for a quick win...",
    type: "Debt Management Tip"
  },
  {
    title: "Negotiate Lower Interest Rates",
    content: "...Call your credit card issuer and request a lower interest rate...",
    type: "Debt Management Tip"
  },
  {
    title: "Avoid Taking on New Debt",
    content: "...Before borrowing, ask yourself if it’s truly necessary...",
    type: "Debt Management Tip"
  },
  {
    title: "Don’t Cosign Loans",
    content: "...Even for a friend or family member, cosigning makes you legally responsible...",
    type: "Debt Management Tip"
  },
  {
    title: "Build Credit the Right Way",
    content: "...Start with a secured credit card or small loan...",
    type: "Debt Management Tip"
  },
  {
    title: "Use Windfalls Wisely",
    content: "...If you get a tax refund, bonus, or gift money, use it to pay off debt...",
    type: "Debt Management Tip"
  },
  {
    title: "Check Your Credit Report",
    content: "...Review your credit report at least once a year...",
    type: "Debt Management Tip"
  },

  // MIXED TIPS
  {
    title: "Make Financial Education a Habit",
    content: "...Spend 10 minutes a day learning about money through videos...",
    type: "Mixed Tip"
  },
  {
    title: "Build Multiple Income Streams",
    content: "...Relying on one source of income is risky...",
    type: "Mixed Tip"
  },
  {
    title: "Buy Needs, Delay Wants",
    content: "...Before making a purchase, ask: Do I need this or want it?...",
    type: "Mixed Tip"
  },
  {
    title: "Plan Big Purchases in Advance",
    content: "...For non-essential items, plan and save before buying...",
    type: "Mixed Tip"
  }
];

const FinancialTipCard = () => {
  const [currentTip, setCurrentTip] = useState(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const [shuffledTips, setShuffledTips] = useState([]);

  // Shuffle tips
  const shuffleTips = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    setShuffledTips(shuffleTips(tips));
  }, []);

  useEffect(() => {
    if (shuffledTips.length > 0) {
      showTip();
    }
  }, [shuffledTips, tipIndex]);

  const typeWriterEffect = (text, onComplete) => {
    let i = 0;
    setDisplayedContent('');

    const type = () => {
      if (i < text.length) {
        setDisplayedContent(prev => prev + text.charAt(i));
        i++;
        setTimeout(type, 30);
      } else if (onComplete) {
        onComplete();
      }
    };

    type();
  };

  const showTip = () => {
    const tip = shuffledTips[tipIndex];
    setCurrentTip(tip);
    typeWriterEffect(tip.content, () => {
      setTimeout(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % shuffledTips.length);
      }, 3500);
    });
  };

  if (!currentTip) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 340,
        maxWidth: '90%',
        backgroundColor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        p: 3,
        zIndex: 9999,
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main', 
          mb: 1.5,
          letterSpacing: 0.3
        }}
      >
        {currentTip.type}: {currentTip.title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          lineHeight: 1.5,
          minHeight: 120,
          whiteSpace: 'pre-wrap'
        }}
      >
        {displayedContent}
      </Typography>
    </Box>
  );
};

export default FinancialTipCard;