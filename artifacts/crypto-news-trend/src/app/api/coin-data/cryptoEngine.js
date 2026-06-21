// lib/cryptoEngine.js

const COINGECKO_KEY = process.env.COINGECKO_KEY || 'CG-TMCHcNu8JF8BUYtJFuo7rGqV';
const TAAPI_SECRET = process.env.TAAPI_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVlIjoiNmEyZjE4YzA5MzEwZjViOGU2NTY5YTRlIiwiaWF0IjoxNzgxNDcxNDYzLCJleHAiOjMzMjg1OTM1NDYzfQ.fEvAVdCd2zXahyLYz4lTy-vJhy-xyfBQNTM2GaukSOg';
const HF_TOKEN = process.env.HF_TOKEN || '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';

export async function getCompleteCoinAnalysis(coinSlug, symbol = 'btc') {
  try {
    // 1. CoinGecko Data (Prices, 7d High/Low, Orderbook Volume)
    const geckoRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinSlug}?tickers=true&market_data=true&community_data=true&developer_data=false`,
      { headers: { 'x-cg-pro-api-key': COINGECKO_KEY } }
    );
    const geckoData = await geckoRes.json();

    // 2. Taapi.io Technical Analysis (RSI, MACD, OrderBook Sentiment)
    const taapiRes = await fetch(`https://api.taapi.io/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TAAPI_SECRET,
        construct: {
          exchange: 'binance',
          symbol: `${symbol.toUpperCase()}/USDT`,
          interval: '1h',
          indicators: [
            { indicator: 'rsi' },
            { indicator: 'macd' },
            { indicator: 'bbands' }
          ]
        }
      })
    });
    const taapiData = await taapiRes.json().catch(() => ({}));

    // 3. HuggingFace AI Market Sentiment Prediction
    let aiPrediction = "Neutral Analysis Hub";
    try {
      const hfRes = await fetch(
        "https://api-inference.huggingface.co/models/ProsusAI/finbert",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: geckoData?.description?.en?.slice(0, 500) || `${coinSlug} market momentum analysis.` }),
        }
      );
      const hfData = await hfRes.json();
      if (Array.isArray(hfData) && hfData[0]) {
        aiPrediction = hfData[0].sort((a, b) => b.score - a.score)[0];
      }
    } catch (_) {}

    return {
      gecko: geckoData,
      taapi: taapiData,
      ai: aiPrediction
    };
  } catch (error) {
    console.error("Engine failure:", error);
    return null;
  }
}