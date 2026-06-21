import { NextRequest, NextResponse } from "next/server";

const CG_KEY = process.env.COINGECKO_KEY || "CG-TMCHcNu8JF8BUYtJFuo7rGqV";
const CG_BASE = "https://api.coingecko.com/api/v3";

// ─── CoinGecko helpers ────────────────────────────────────────────────────────
async function cgFetch(path: string) {
  const url = `${CG_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "x-cg-demo-api-key": CG_KEY, Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`CoinGecko error ${res.status}: ${path}`);
  return res.json();
}

// ─── Technical indicator calculations ────────────────────────────────────────
function calcRSI(prices: number[], period = 14): number | null {
  if (prices.length < period + 1) return null;
  const changes = prices.slice(1).map((p, i) => p - prices[i]);
  let gains = 0, losses = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) gains += changes[i];
    else losses -= changes[i];
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period; i < changes.length; i++) {
    const g = changes[i] > 0 ? changes[i] : 0;
    const l = changes[i] < 0 ? -changes[i] : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

function calcEMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return parseFloat(ema.toFixed(8));
}

function calcMACD(prices: number[]): { macd: number | null; signal: number | null } {
  const ema12 = calcEMA(prices, 12);
  const ema26 = calcEMA(prices, 26);
  if (ema12 === null || ema26 === null) return { macd: null, signal: null };
  const macdLine = ema12 - ema26;
  // Approximate signal with EMA of last few MACD values
  const macdValues: number[] = [];
  for (let i = Math.max(0, prices.length - 35); i < prices.length; i++) {
    const e12 = calcEMA(prices.slice(0, i + 1), 12);
    const e26 = calcEMA(prices.slice(0, i + 1), 26);
    if (e12 !== null && e26 !== null) macdValues.push(e12 - e26);
  }
  const signalLine = macdValues.length >= 9 ? calcEMA(macdValues, 9) : null;
  return { macd: parseFloat(macdLine.toFixed(8)), signal: signalLine };
}

function calcBollingerBands(prices: number[], period = 20, stdDev = 2): { upper: number | null; lower: number | null } {
  if (prices.length < period) return { upper: null, lower: null };
  const slice = prices.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
  const sd = Math.sqrt(variance);
  return {
    upper: parseFloat((mean + stdDev * sd).toFixed(8)),
    lower: parseFloat((mean - stdDev * sd).toFixed(8)),
  };
}

function calcStochastic(highs: number[], lows: number[], closes: number[], period = 14): number | null {
  if (closes.length < period) return null;
  const h = highs.slice(-period);
  const l = lows.slice(-period);
  const highestH = Math.max(...h);
  const lowestL = Math.min(...l);
  if (highestH === lowestL) return 50;
  return parseFloat((((closes[closes.length - 1] - lowestL) / (highestH - lowestL)) * 100).toFixed(2));
}

// ─── Support / Resistance via pivot points ───────────────────────────────────
function calcSR(ohlc: Array<{ high: number; low: number; close: number }>) {
  if (ohlc.length < 2) return { support: [], resistance: [] };
  const recent = ohlc.slice(-7);
  const high = Math.max(...recent.map((d) => d.high));
  const low = Math.min(...recent.map((d) => d.low));
  const close = recent[recent.length - 1].close;
  const pivot = (high + low + close) / 3;
  const r1 = 2 * pivot - low;
  const r2 = pivot + (high - low);
  const r3 = high + 2 * (pivot - low);
  const s1 = 2 * pivot - high;
  const s2 = pivot - (high - low);
  const s3 = low - 2 * (high - pivot);
  return {
    support: [s1, s2, s3].filter((v) => v > 0).map((v) => parseFloat(v.toFixed(8))),
    resistance: [r1, r2, r3].map((v) => parseFloat(v.toFixed(8))),
  };
}

// ─── Prediction engine ────────────────────────────────────────────────────────
function generatePrediction(
  coin: Record<string, number>,
  technical: Record<string, number | null>,
  orderBook: { buyPressure: number; sellPressure: number }
) {
  const reasons: string[] = [];
  let bullScore = 0;
  let bearScore = 0;

  // RSI
  if (technical.rsi !== null) {
    if (technical.rsi < 30) { bullScore += 2; reasons.push("🟢 RSI oversold (" + technical.rsi + ") — potential bounce expected"); }
    else if (technical.rsi > 70) { bearScore += 2; reasons.push("🔴 RSI overbought (" + technical.rsi + ") — correction possible"); }
    else if (technical.rsi > 50) { bullScore += 1; reasons.push("🟢 RSI above 50 — mild bullish momentum"); }
    else { bearScore += 1; reasons.push("🔴 RSI below 50 — mild bearish pressure"); }
  }

  // MACD
  if (technical.macd !== null && technical.macdSignal !== null) {
    if (technical.macd > technical.macdSignal) { bullScore += 2; reasons.push("🟢 MACD above signal line — bullish crossover"); }
    else { bearScore += 2; reasons.push("🔴 MACD below signal line — bearish crossover"); }
  }

  // EMA
  if (technical.ema20 !== null && technical.ema50 !== null) {
    if (technical.ema20 > technical.ema50) { bullScore += 1; reasons.push("🟢 EMA20 > EMA50 — short-term uptrend active"); }
    else { bearScore += 1; reasons.push("🔴 EMA20 < EMA50 — short-term downtrend active"); }
  }

  // Price vs EMA20
  if (technical.ema20 !== null) {
    if (coin.current_price > technical.ema20) { bullScore += 1; reasons.push("🟢 Price above EMA20 — upward momentum"); }
    else { bearScore += 1; reasons.push("🔴 Price below EMA20 — downward pressure"); }
  }

  // Bollinger Bands
  if (technical.bbLower !== null && technical.bbUpper !== null) {
    if (coin.current_price < technical.bbLower) { bullScore += 2; reasons.push("🟢 Price below lower Bollinger Band — oversold, bounce likely"); }
    else if (coin.current_price > technical.bbUpper) { bearScore += 2; reasons.push("🔴 Price above upper Bollinger Band — overbought, pullback likely"); }
    else { reasons.push("🟡 Price inside Bollinger Bands — normal range"); }
  }

  // 24h change
  if (coin.change24h > 5) { bullScore += 1; reasons.push(`🟢 Strong 24h gain +${coin.change24h.toFixed(1)}% — momentum active`); }
  else if (coin.change24h < -5) { bearScore += 1; reasons.push(`🔴 Sharp 24h drop ${coin.change24h.toFixed(1)}% — selling pressure`); }

  // 7d change
  if (coin.change7d !== undefined) {
    if (coin.change7d > 10) { bullScore += 1; reasons.push(`🟢 7-day trend +${coin.change7d.toFixed(1)}% — weekly uptrend`); }
    else if (coin.change7d < -10) { bearScore += 1; reasons.push(`🔴 7-day trend ${coin.change7d.toFixed(1)}% — weekly downtrend`); }
  }

  // Volume
  if (coin.volume_ratio > 1.5) { bullScore += 1; reasons.push("🟢 High volume — strong market participation"); }
  else if (coin.volume_ratio < 0.5) { reasons.push("🟡 Low volume — weak conviction, caution advised"); }

  // Buy/Sell pressure
  if (orderBook.buyPressure > 60) { bullScore += 1; reasons.push(`🟢 Buy pressure ${orderBook.buyPressure}% dominates market`); }
  else if (orderBook.sellPressure > 60) { bearScore += 1; reasons.push(`🔴 Sell pressure ${orderBook.sellPressure}% dominates market`); }

  // Stochastic
  if (technical.stoch !== null) {
    if (technical.stoch < 20) { bullScore += 1; reasons.push(`🟢 Stochastic oversold (${technical.stoch}) — reversal signal`); }
    else if (technical.stoch > 80) { bearScore += 1; reasons.push(`🔴 Stochastic overbought (${technical.stoch}) — reversal signal`); }
  }

  const total = bullScore + bearScore;
  const direction = bullScore > bearScore ? "UP" : bearScore > bullScore ? "DOWN" : "NEUTRAL";
  const dominant = Math.max(bullScore, bearScore);
  const confidence = total > 0 ? Math.min(95, Math.round(40 + (dominant / total) * 55)) : 50;

  const price = coin.current_price;
  const vol = Math.abs(coin.change24h) / 100;
  const targetMulti = direction === "UP" ? 1 + Math.max(0.015, vol * 1.2) : 1 - Math.max(0.015, vol * 1.2);
  const slMulti = direction === "UP" ? 1 - Math.max(0.01, vol * 0.7) : 1 + Math.max(0.01, vol * 0.7);

  const sentiments: Record<string, string> = {
    UP: confidence > 75 ? "Strong bullish confluence — multiple indicators agree" : "Moderate bullish signals — proceed with caution",
    DOWN: confidence > 75 ? "Strong bearish pressure — risk management essential" : "Moderate bearish signals — wait for confirmation",
    NEUTRAL: "Mixed signals — market consolidating, wait for clearer direction",
  };

  return {
    direction: direction as "UP" | "DOWN" | "NEUTRAL",
    confidence,
    targetPrice: parseFloat((price * targetMulti).toFixed(8)),
    stopLoss: parseFloat((price * slMulti).toFixed(8)),
    reasons,
    bullScore,
    bearScore,
    sentiment: sentiments[direction],
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const coinId = req.nextUrl.searchParams.get("id") || "bitcoin";

  try {
    // 1. Fetch coin details + market data
    const [coinData, ohlcRaw, marketChart] = await Promise.all([
      cgFetch(`/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`),
      cgFetch(`/coins/${coinId}/ohlc?vs_currency=usd&days=7`),
      cgFetch(`/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`),
    ]);

    // 2. Prepare OHLC
    const ohlc7d = (ohlcRaw as number[][]).map(([time, open, high, low, close]) => ({ time, open, high, low, close }));

    // 3. Close prices for indicators
    const prices: number[] = (marketChart.prices as number[][]).map(([, p]) => p);
    const highs = ohlc7d.map((d) => d.high);
    const lows = ohlc7d.map((d) => d.low);
    const closes = ohlc7d.map((d) => d.close);

    // 4. Technical indicators
    const rsi = calcRSI(prices.length >= 15 ? prices : closes);
    const { macd, signal: macdSignal } = calcMACD(prices.length >= 26 ? prices : closes);
    const ema20 = calcEMA(prices.length >= 20 ? prices : closes, 20);
    const ema50 = calcEMA(prices.length >= 50 ? prices : closes, 50);
    const bb = calcBollingerBands(prices.length >= 20 ? prices : closes);
    const stoch = calcStochastic(highs, lows, closes);

    const technical = {
      rsi,
      macd,
      macdSignal,
      ema20,
      ema50,
      bbUpper: bb.upper,
      bbLower: bb.lower,
      stoch,
      adx: null,
      obv: null,
    };

    // 5. Support & Resistance
    const { support, resistance } = calcSR(ohlc7d);

    // 6. Order book proxy (simulated from price action + volume)
    const recentChanges = prices.slice(-5).map((p, i) => (i > 0 ? p - prices.slice(-5)[i - 1] : 0));
    const posChanges = recentChanges.filter((c) => c > 0).length;
    const buyPressure = Math.round(30 + (posChanges / 5) * 40 + (coinData.market_data.price_change_percentage_24h > 0 ? 10 : 0));
    const sellPressure = 100 - buyPressure;
    const orderBook = {
      buyPressure: Math.min(90, Math.max(10, buyPressure)),
      sellPressure: Math.min(90, Math.max(10, sellPressure)),
      trend: buyPressure > 55 ? "Buyers dominant — bullish market sentiment" : buyPressure < 45 ? "Sellers dominant — bearish market sentiment" : "Balanced — neither side is in control",
    };

    // 7. Yesterday & week ago prices
    const priceHistory = (marketChart.prices as number[][]).map(([, p]) => p);
    const yesterdayPrice = priceHistory.length >= 2 ? priceHistory[priceHistory.length - 2] : coinData.market_data.current_price.usd;
    const weekAgoPrice = priceHistory.length >= 8 ? priceHistory[priceHistory.length - 8] : coinData.market_data.current_price.usd;

    // 8. Build coin object
    const coin = {
      id: coinData.id,
      symbol: coinData.symbol,
      name: coinData.name,
      image: coinData.image.large,
      current_price: coinData.market_data.current_price.usd,
      price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coinData.market_data.price_change_percentage_7d_in_currency?.usd ?? 0,
      high_24h: coinData.market_data.high_24h.usd,
      low_24h: coinData.market_data.low_24h.usd,
      market_cap: coinData.market_data.market_cap.usd,
      total_volume: coinData.market_data.total_volume.usd,
      circulating_supply: coinData.market_data.circulating_supply,
      ath: coinData.market_data.ath.usd,
      atl: coinData.market_data.atl.usd,
      last_updated: coinData.last_updated,
    };

    // 9. Generate prediction
    const predInput = {
      current_price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      change7d: coin.price_change_percentage_7d_in_currency,
      volume_ratio: coin.total_volume / (coin.market_cap / 100),
    };
    const prediction = generatePrediction(predInput, technical, orderBook);

    return NextResponse.json({
      coin,
      ohlc7d,
      technical,
      prediction,
      orderBook,
      support,
      resistance,
      yesterdayPrice,
      weekAgoPrice,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}