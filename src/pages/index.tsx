import { useState } from 'react';
import { TrendingUp, RefreshCw, Loader2, Zap, BarChart3 } from 'lucide-react';
import { MarketInput } from '@/components/MarketInput';
import { PredictionCard } from '@/components/PredictionCard';
import { PriceChart } from '@/components/PriceChart';
import { HistoryList } from '@/components/HistoryList';
import { toast } from '@/hooks/use-toast';

const TROY_OUNCE_TO_GRAMS = 31.1035;
const GRAMS_PER_PAWAN = 8.0;

interface MarketData {
  spx: number;
  uso: number;
  slv: number;
  eurUsd: number;
  usdLkr: number;
}

interface Prediction {
  predictedUsd: number;
  lkrPawan: number;
  lkrGram: number;
  analysis: string;
  timestamp: Date;
}

interface SavedPrediction extends Prediction {
  id: string;
  date: Date;
}

const Index = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    spx: 4780.20,
    uso: 75.50,
    slv: 23.40,
    eurUsd: 1.09,
    usdLkr: 309.03,
  });

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [status, setStatus] = useState('Ready');

  const handleRefreshRates = async () => {
    setIsFetching(true);
    setStatus('Syncing...');

    // Simulate fetching real-time rates
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update with slightly varied values
    setMarketData(prev => ({
      spx: prev.spx + (Math.random() - 0.5) * 50,
      uso: prev.uso + (Math.random() - 0.5) * 2,
      slv: prev.slv + (Math.random() - 0.5) * 0.5,
      eurUsd: prev.eurUsd + (Math.random() - 0.5) * 0.01,
      usdLkr: prev.usdLkr + (Math.random() - 0.5) * 2,
    }));

    setStatus('Synced');
    setIsFetching(false);
    toast({
      title: "Rates Updated",
      description: "Market data has been refreshed",
    });
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setStatus('Analyzing...');

    // Simulate AI prediction
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Determine mock base price from inputs (just for simulation feel)
    // In reality, this would call the backend API
    const baseGoldPrice = 1600 + (marketData.spx * 0.1) + (marketData.slv * 15) - (marketData.uso * 4);
    const randomVar = (Math.random() - 0.5) * 50;

    const predictedUsd = Math.round(Math.abs(baseGoldPrice + randomVar)); // Ensure positive
    const lkrPricePerOz = predictedUsd * marketData.usdLkr;
    const lkrPricePerGram = lkrPricePerOz / TROY_OUNCE_TO_GRAMS;

    // Pawan is typically 22k gold (standard jewellery gold)
    // Formula: (Price per Gram 24k) * 8 * (22/24)
    const KARAT_22_FACTOR = 0.9167; // 22/24
    const lkrPricePerPawan = lkrPricePerGram * GRAMS_PER_PAWAN * KARAT_22_FACTOR;

    const analyses = [
      "Market volatility in S&P 500 suggests a flight to safety, potentially boosting gold prices.",
      "Strength in the EUR/USD pair indicates dollar weakness, creating a favorable environment for gold.",
      "Silver's current momentum is providing strong support for the precious metals complex.",
      "Oil market fluctuations are currently having a neutral impact on inflation expectations.",
    ];

    const newPrediction: Prediction = {
      predictedUsd,
      lkrPawan: lkrPricePerPawan,
      lkrGram: lkrPricePerGram, // Keeping Gram as 24k for reference, or should it match? Let's keep 24k for "Market Price"
      analysis: analyses[Math.floor(Math.random() * analyses.length)],
      timestamp: new Date(),
    };

    setPrediction(newPrediction);
    setStatus('Ready');
    setIsLoading(false);

    toast({
      title: "Prediction Generated",
      description: `24h forecast: Rs. ${lkrPricePerPawan.toLocaleString(undefined, { maximumFractionDigits: 0 })} / 22k Pawan`,
    });
  };

  const handleSave = () => {
    if (!prediction) return;

    const savedItem: SavedPrediction = {
      ...prediction,
      id: Date.now().toString(),
      date: new Date(),
    };

    setSavedPredictions(prev => [savedItem, ...prev]);
    toast({
      title: "Prediction Saved",
      description: "Added to your history",
    });
  };

  const chartData = [...savedPredictions].reverse().map(p => ({
    name: p.date.toLocaleDateString(),
    price: p.lkrPawan,
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in relative overflow-hidden group">
          {/* Decorative shine */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight flex items-baseline gap-2">
                GOLD VISION
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </h1>
              <p className="text-sm font-medium text-muted-foreground/80 tracking-wide">
                PREMIUM MARKET INTELLIGENCE
              </p>
            </div>
          </div>

          <button
            onClick={handleRefreshRates}
            disabled={isFetching}
            className="btn-ghost flex items-center justify-center gap-2 relative z-10"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Sync Market Data</span>
          </button>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card p-6 md:p-8">
              <h2 className="stat-label mb-6 flex items-center gap-3 text-primary">
                <Zap className="w-4 h-4" />
                Live Market Inputs
              </h2>
              <div className="space-y-5">
                <MarketInput
                  label="S&P 500 Index (SPX)"
                  value={marketData.spx}
                  onChange={(v) => setMarketData(p => ({ ...p, spx: v }))}
                  icon="spx"
                />
                <MarketInput
                  label="United States Oil (USO)"
                  value={marketData.uso}
                  onChange={(v) => setMarketData(p => ({ ...p, uso: v }))}
                  icon="oil"
                />
                <MarketInput
                  label="Silver Price (SLV)"
                  value={marketData.slv}
                  onChange={(v) => setMarketData(p => ({ ...p, slv: v }))}
                  icon="silver"
                />
                <MarketInput
                  label="EUR / USD Rate"
                  value={marketData.eurUsd}
                  onChange={(v) => setMarketData(p => ({ ...p, eurUsd: v }))}
                  icon="exchange"
                />
                <div className="pt-4 border-t border-border/50">
                  <MarketInput
                    label="USD / LKR (Conversion)"
                    value={marketData.usdLkr}
                    onChange={(v) => setMarketData(p => ({ ...p, usdLkr: v }))}
                    icon="dollar"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Running Model...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span>Generate Prediction</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Prediction & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <PredictionCard prediction={prediction} onSave={handleSave} />
            </div>

            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="stat-label mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Price Trend
              </h3>
              <PriceChart data={chartData} />
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <HistoryList items={savedPredictions} status={status} />
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-[10px] text-muted-foreground/40 uppercase tracking-widest">
          Predictions are for informational purposes only
        </footer>
      </div>
    </div>
  );
};

export default Index;
