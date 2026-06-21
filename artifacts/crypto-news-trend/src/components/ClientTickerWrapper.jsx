"use client";

import dynamic from "next/dynamic";
// This is perfectly valid inside a Client Component
const PriceTicker = dynamic(() => import("@/components/PriceTicker"), {
  ssr: false,
});

export default function ClientTickerWrapper() {
  return <PriceTicker />;
}