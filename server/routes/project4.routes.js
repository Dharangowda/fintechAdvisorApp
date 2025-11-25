const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY || '';

// Helper function to simulate exchange data (since CoinGecko doesn't provide bid/ask)
const simulateExchangeData = (price) => {
  const bid = price * 0.995; // 0.5% below market
  const ask = price * 1.005; // 0.5% above market
  const last = price;
  const btcVol = (Math.random() * 1000).toFixed(4);
  const usdVol = (btcVol * price).toFixed(2);
  
  return {
    bid: bid.toFixed(2),
    ask: ask.toFixed(2),
    last: last.toFixed(2),
    volume: {
      BTC: btcVol,
      USD: usdVol
    }
  };
};

// GET /api/crypto-checker/search?query=BTC
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing query parameter'
      });
    }

    const response = await axios.get(`${COINGECKO_API}/search?query=${query}`, {
      headers: { 'x-cg-demo-api-key': API_KEY },
      timeout: 5000
    });

    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search cryptocurrencies'
    });
  }
});

// POST /api/crypto-checker/ask
router.post('/ask', async (req, res) => {
  try {
    const symbol = req.body.prompt;
    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid input: Please provide a cryptocurrency symbol'
      });
    }

    // Step 1: Search for the coin
    const cleanSymbol = symbol.replace(/USD$/i, '').toLowerCase();
    const searchResponse = await axios.get(`${COINGECKO_API}/search?query=${cleanSymbol}`, {
      headers: { 'x-cg-demo-api-key': API_KEY },
      timeout: 5000
    });

    if (!searchResponse.data.coins?.length) {
      return res.status(404).json({
        success: false,
        error: `No results found for "${symbol}"`,
        suggestion: 'Try symbols like BTC, ETH, SOL'
      });
    }

    // Step 2: Get price data
    const coinId = searchResponse.data.coins[0].id;
    const priceResponse = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd`,
      { 
        headers: { 'x-cg-demo-api-key': API_KEY },
        timeout: 5000
      }
    );

    if (!priceResponse.data[coinId]?.usd) {
      return res.status(404).json({
        success: false,
        error: 'No price data available for this cryptocurrency'
      });
    }

    // Step 3: Simulate exchange data (bid/ask/volume)
    const price = priceResponse.data[coinId].usd;
    const exchangeData = simulateExchangeData(price);

    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      name: searchResponse.data.coins[0].name,
      ...exchangeData
    });

  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cryptocurrency data',
      details: error.message
    });
  }
});

module.exports = router;