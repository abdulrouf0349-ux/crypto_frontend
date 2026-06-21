// app/layout.js
import { Providers } from "./providers";
import "../index.css";

export const metadata = {
  metadataBase: new URL("https://cryptonewstrend.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}