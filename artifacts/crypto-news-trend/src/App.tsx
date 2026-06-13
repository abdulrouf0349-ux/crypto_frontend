import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SupportUsFloat } from "@/components/SupportUsFloat";

import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Whales from "@/pages/Whales";
import ICO from "@/pages/ICO";
import ICODetail from "@/pages/ICODetail";
import CoinAnalysis from "@/pages/CoinAnalysis";
import NewsArticle from "@/pages/NewsArticle";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/events" component={Events} />
          <Route path="/crypto-whales" component={Whales} />
          <Route path="/ico" component={ICO} />
          <Route path="/ico/:slug" component={ICODetail} />
          <Route path="/coin-analysis" component={CoinAnalysis} />
          <Route path="/news/:slug" component={NewsArticle} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <SupportUsFloat />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
