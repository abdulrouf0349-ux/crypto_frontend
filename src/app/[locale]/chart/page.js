// Is component ko Search result ke niche dikhayein
'use client'

import React, { useEffect, useRef } from 'react';

export default function CryptoChart() {
  const container = useRef();
// symbol agar undefined ho to default 'BTC' dikhaye
  const symbol = 'BTC';
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `BINANCE:${symbol}USDT`, // Example: BINANCE:BTCUSDT
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview_chart"
    });
    container.current.appendChild(script);
  }, [symbol]);

  return <div id="tradingview_chart" ref={container} style={{ height: "500px" }} />;
}