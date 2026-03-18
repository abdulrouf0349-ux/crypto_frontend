// src/app/api/coin-analysis/route.js

import { pipeline } from '@xenova/transformers';

const CG = 'https://api.coingecko.com/api/v3';

// ── TradingView Symbol Finder ─────────────────────────────────
const EXCHANGE_TV_MAP = {
  'Binance':'BINANCE','Bybit':'BYBIT','OKX':'OKX',
  'Coinbase Exchange':'COINBASE','Kraken':'KRAKEN',
  'KuCoin':'KUCOIN','Gate.io':'GATEIO','MEXC':'MEXC',
  'Bitget':'BITGET','Huobi':'HUOBI','HTX':'HUOBI',
  'Bitfinex':'BITFINEX','Gemini':'GEMINI','Bitstamp':'BITSTAMP',
  'Crypto.com Exchange':'CRYPTO','Poloniex':'POLONIEX',
};
const TV_PRIORITY = ['BINANCE','BYBIT','OKX','COINBASE','KRAKEN','KUCOIN','GATEIO','MEXC','BITGET'];

function getBestTvSymbol(tickers, symbol) {
  const s = (symbol||'').toUpperCase();
  if (!tickers?.length) return `BINANCE:${s}USDT`;

  const usdTickers = tickers.filter(t =>
    (t.target==='USDT'||t.target==='USD') && EXCHANGE_TV_MAP[t.market?.name]
  );
  usdTickers.sort((a,b) => {
    const ai = TV_PRIORITY.indexOf(EXCHANGE_TV_MAP[a.market.name]??'');
    const bi = TV_PRIORITY.indexOf(EXCHANGE_TV_MAP[b.market.name]??'');
    return (ai===-1?999:ai) - (bi===-1?999:bi);
  });
  if (usdTickers.length) {
    const best = usdTickers[0];
    return `${EXCHANGE_TV_MAP[best.market.name]}:${s}${best.target}`;
  }
  return `BINANCE:${s}USDT`;
}



let finbert = null;
async function getFinbert() {
  if (!finbert) {
    finbert = await pipeline('text-classification', 'Xenova/finbert', { quantized: true });
  }
  return finbert;
}

async function searchCoin(query) {
  const res  = await fetch(`${CG}/search?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  const coin = data?.coins?.[0];
  if (!coin) throw new Error(`"${query}" not found`);
  return { id: coin.id, name: coin.name, symbol: coin.symbol };
}

async function getMarketData(coinId) {
  const res  = await fetch(
    `${CG}/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data?.[0];
}

async function getOhlcData(coinId) {
  const res = await fetch(
    `${CG}/coins/${coinId}/ohlc?vs_currency=usd&days=14`,
    { next: { revalidate: 300 } }
  );
  return await res.json();
}

async function getCoinDetails(coinId) {
  const res = await fetch(
    `${CG}/coins/${coinId}?localization=false&tickers=true&market_data=false&community_data=false&developer_data=false`,
    { next: { revalidate: 3600 } }
  );
  return await res.json();
}

function toNum(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function calculateRSI(ohlcData, period = 14) {
  if (!ohlcData || ohlcData.length < period + 1) return 50;
  const closes = ohlcData.map(c => c[4]);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains  += diff;
    else          losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - (100 / (1 + avgGain / avgLoss));
}

function analyzeVolume(market) {
  const volume = toNum(market?.total_volume);
  const mcap   = toNum(market?.market_cap);
  const ratio  = mcap > 0 ? (volume / mcap) * 100 : 0;
  return {
    ratio:    ratio.toFixed(2),
    isHigh:   ratio > 20,
    isMedium: ratio > 10 && ratio <= 20,
    isLow:    ratio <= 10,
    label:    ratio > 20 ? 'HIGH' : ratio > 10 ? 'MEDIUM' : 'LOW',
  };
}

function approximateMACD(ohlcData) {
  if (!ohlcData || ohlcData.length < 26) return { signal: 'neutral', value: '0' };
  const closes = ohlcData.map(c => c[4]);
  const ema = (data, period) => {
    const k = 2 / (period + 1);
    return data.reduce((prev, curr) => curr * k + prev * (1 - k));
  };
  const macd = ema(closes, 12) - ema(closes, 26);
  return { value: macd.toFixed(4), signal: macd > 0 ? 'bullish' : 'bearish' };
}

function buildSignal({ market, rsi, volumeData, macd, sentiment }) {
  let score = 50;
  const reasons = [];

  if (sentiment?.label === 'positive') { score += 20; reasons.push('✅ AI sentiment: Bullish'); }
  if (sentiment?.label === 'negative') { score -= 20; reasons.push('⚠️ AI sentiment: Bearish'); }
  if (sentiment?.label === 'neutral')  { reasons.push('➡️ AI sentiment: Neutral'); }

  const c24h = toNum(market?.price_change_percentage_24h);
  const c7d  = toNum(market?.price_change_percentage_7d);
  const c30d = toNum(market?.price_change_percentage_30d);

  if (c24h > 5)   { score += 8;  reasons.push(`✅ Strong 24h: +${c24h.toFixed(1)}%`); }
  if (c24h < -5)  { score -= 8;  reasons.push(`⚠️ Drop 24h: ${c24h.toFixed(1)}%`);   }
  if (c7d  > 10)  { score += 10; reasons.push(`✅ Bullish 7d: +${c7d.toFixed(1)}%`);  }
  if (c7d  < -10) { score -= 10; reasons.push(`⚠️ Bearish 7d: ${c7d.toFixed(1)}%`);  }
  if (c30d > 20)  { score += 7;  reasons.push(`✅ Strong 30d: +${c30d.toFixed(1)}%`); }
  if (c30d < -20) { score -= 7;  reasons.push(`⚠️ Weak 30d: ${c30d.toFixed(1)}%`);   }

  const rsiNum = toNum(rsi);
  if (rsiNum < 30)      { score += 15; reasons.push(`✅ RSI oversold (${rsiNum.toFixed(0)}) — Buy zone`);    }
  else if (rsiNum < 45) { score += 7;  reasons.push(`✅ RSI low (${rsiNum.toFixed(0)})`);                    }
  else if (rsiNum > 70) { score -= 15; reasons.push(`⚠️ RSI overbought (${rsiNum.toFixed(0)}) — Sell zone`); }
  else if (rsiNum > 60) { score -= 7;  reasons.push(`⚠️ RSI elevated (${rsiNum.toFixed(0)})`);               }
  else                  { reasons.push(`➡️ RSI neutral (${rsiNum.toFixed(0)})`); }

  if (volumeData.isHigh)   { score += 10; reasons.push(`✅ High volume (${volumeData.ratio}%)`);   }
  if (volumeData.isMedium) { score += 5;  reasons.push(`➡️ Medium volume (${volumeData.ratio}%)`); }
  if (volumeData.isLow)    { score -= 5;  reasons.push(`⚠️ Low volume (${volumeData.ratio}%)`);    }

  if (macd.signal === 'bullish') { score += 10; reasons.push('✅ MACD bullish'); }
  if (macd.signal === 'bearish') { score -= 10; reasons.push('⚠️ MACD bearish'); }

  score = Math.max(0, Math.min(100, score));

  let signal, signalEmoji, summary;
  if (score >= 65) {
    signal = 'BUY'; signalEmoji = '🟢';
    summary = 'Strong buy signal. Multiple bullish indicators aligned.';
  } else if (score <= 35) {
    signal = 'SELL'; signalEmoji = '🔴';
    summary = 'Bearish pressure dominant. Consider reducing exposure.';
  } else {
    signal = 'HOLD'; signalEmoji = '🟡';
    summary = 'Mixed signals. Wait for clear breakout or breakdown.';
  }

  const price = toNum(market?.current_price);
  return {
    signal, signalEmoji, score, summary, reasons,
    levels: {
      support:    (price * 0.92).toFixed(6),
      resistance: (price * 1.08).toFixed(6),
      stopLoss:   (price * 0.88).toFixed(6),
      target1:    (price * 1.12).toFixed(6),
      target2:    (price * 1.28).toFixed(6),
      target3:    (price * 1.50).toFixed(6),
    },
    indicators: {
      rsi:         rsiNum.toFixed(1),
      rsiZone:     rsiNum < 30 ? 'Oversold' : rsiNum > 70 ? 'Overbought' : 'Neutral',
      macd:        macd.signal,
      volume:      volumeData.label,
      volumeRatio: volumeData.ratio,
      sentiment:   sentiment?.label || 'neutral',
    },
  };
}

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query?.trim()) return Response.json({ error: 'Coin name required' }, { status: 400 });

    const { id: coinId, name, symbol } = await searchCoin(query);

    const [market, ohlcData, details] = await Promise.all([
      getMarketData(coinId),
      getOhlcData(coinId),
      getCoinDetails(coinId),
    ]);

    if (!market) throw new Error('Market data not available');

    const rsi        = calculateRSI(ohlcData);
    const volumeData = analyzeVolume(market);
    const macd       = approximateMACD(ohlcData);

    // FinBERT sentiment
    let sentiment = null;
    try {
      const c24h   = toNum(market.price_change_percentage_24h);
      const model  = await getFinbert();
      const text   = `${name} ${symbol} price ${c24h > 0 ? 'increased' : 'decreased'} ${Math.abs(c24h).toFixed(1)}% today`;
      const result = await model(text, { topk: 1 });
      sentiment    = result?.[0] ? { ...result[0], label: result[0].label.toLowerCase() } : null;
    } catch (e) {
      console.log('FinBERT skip:', e.message);
    }

    const analysis = buildSignal({ market, rsi, volumeData, macd, sentiment });
    const tvSymbol  = getBestTvSymbol(details.tickers, market.symbol);

    const safeFixed = (val, digits = 2) => {
      const n = toNum(val);
      return n.toFixed(digits);
    };

    return Response.json({
      tvSymbol,
      id: coinId, name: market.name,
      symbol: (market.symbol || '').toUpperCase(),
      image:  market.image,
      rank:   market.market_cap_rank,
      price:     toNum(market.current_price),
      change1h:  safeFixed(market.price_change_percentage_1h_in_currency),
      change24h: safeFixed(market.price_change_percentage_24h),
      change7d:  safeFixed(market.price_change_percentage_7d_in_currency),
      change30d: safeFixed(market.price_change_percentage_30d_in_currency),
      marketCap: toNum(market.market_cap),
      volume24h: toNum(market.total_volume),
      ath:       toNum(market.ath),
      athChange: safeFixed(market.ath_change_percentage),
      atl:       toNum(market.atl),
      supply: {
        circulating: market.circulating_supply,
        total:       market.total_supply,
        max:         market.max_supply,
      },
      links: {
        website:    details.links?.homepage?.[0] || '',
        whitepaper: details.links?.whitepaper    || '',
        twitter:    details.links?.twitter_screen_name
                      ? `https://twitter.com/${details.links.twitter_screen_name}` : '',
        reddit:     details.links?.subreddit_url || '',
        github:     details.links?.repos_url?.github?.[0] || '',
        telegram:   details.links?.telegram_channel_identifier
                      ? `https://t.me/${details.links.telegram_channel_identifier}` : '',
        explorer:   details.links?.blockchain_site?.[0] || '',
        coingecko:  `https://www.coingecko.com/en/coins/${coinId}`,
      },
      exchanges: (details.tickers || []).slice(0, 10).map(t => ({
        name:   t.market?.name,
        pair:   `${t.base}/${t.target}`,
        volume: t.volume,
        url:    t.trade_url,
      })),
      description: (details.description?.en || '').replace(/<[^>]+>/g, '').slice(0, 600),
      categories:  (details.categories || []).filter(Boolean).slice(0, 6),
      analysis,
    });

  } catch (err) {
    console.error('Coin Analysis Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}