import React, { useState } from 'react';
import axios from 'axios';

const CryptoTracker = () => {
  const [symbol, setSymbol] = useState('');
  const [response, setResponse] = useState('Enter a symbol to get started!');
  const [loading, setLoading] = useState(false);

  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f9f9f9',
      color: '#333'
    },
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    h1: {
      textAlign: 'center',
      color: '#4CAF50'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    button: {
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed'
    },
    responseBox: {
      marginTop: '20px',
      padding: '15px',
      background: '#f1f1f1',
      borderRadius: '4px',
      fontSize: '16px'
    },
    infoBox: {
      marginTop: '30px',
      padding: '15px',
      background: '#e7f5ff',
      borderRadius: '4px',
      fontSize: '14px',
      color: '#0056b3'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setResponse('Please enter a valid cryptocurrency symbol (e.g., BTCUSD).');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/crypto-checker/ask', 
        { prompt: symbol },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const data = res.data;
      const priceText = `Current price: $${data.price}`;
      const changeText = `24h change: ${data.change_24h?.toFixed(2)}%`;
      const volumeText = `24h volume: $${data.volume?.toLocaleString()}`;

      setResponse(`
        <h3>${data.name} (${data.symbol})</h3>
        <p>${priceText}</p>
        <p>${changeText}</p>
        <p>${volumeText}</p>
      `);
    } catch (error) {
      setResponse(`
        <p style="color: red">Error: ${error.response?.data?.error || error.message}</p>
        <p>Make sure the backend server is running at http://localhost:3000</p>
      `);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Crypto Chatbot 🤖</h1>
        <p>Get real-time cryptocurrency data</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Cryptocurrency Symbol:</label>
          <input
            type="text"
            placeholder="e.g., BTC, ETH"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            disabled={loading}
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {loading ? 'Loading...' : 'Get Data'}
          </button>
        </form>
        
        <div 
          style={styles.responseBox} 
          dangerouslySetInnerHTML={{ __html: response }} 
        />
        
        <div style={styles.infoBox}>
          <h3>How to use:</h3>
          <ul>
            <li>Enter any cryptocurrency symbol (BTC, ETH, etc.)</li>
            <li>Data comes from CoinGecko API</li>
            <li>Backend must be running on port 3000</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CryptoTracker;