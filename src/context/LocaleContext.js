'use client';
import { createContext, useContext } from 'react';

// Context Create Karein
const LocaleContext = createContext();

export default function ClientLayout({ children, dict, locale }) {
  return (
    // Is Provider ke andar jo bhi value hogi, wo poore app mein mil jayegi
    <LocaleContext.Provider value={{ dict, locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// Custom Hook: Taake page par asani se use kar saken
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a ClientLayout");
  }
  return context;
};