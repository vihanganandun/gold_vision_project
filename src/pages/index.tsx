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
  goldUsd: number;
  usdLkr: number;
  oilPrice: number;
  inflation: number;
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
    goldUsd: 4600,
    usdLkr: 309.03,
    oilPrice: 72.80,
    inflation: 4.2,
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
    
    // Update with slightly varied values to simulate real-time changes
    setMarketData(prev => ({
      goldUsd: prev.goldUsd + (Math.random() - 0.5) * 20,
      usdLkr: prev.usdLkr + (Math.random() - 0.5) * 2,
      oilPrice: prev.oilPrice + (Math.random() - 0.5) * 3,
      inflation: prev.inflation,
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

    // Calculate prediction based on market data
    const predictedChange = (Math.random() - 0.3) * 50; // Slight upward bias
    const predictedUsd = Math.round(marketData.goldUsd + predictedChange);
    const lkrPricePerOz = predictedUsd * marketData.usdLkr;
    const lkrPricePerGram = lkrPricePerOz / TROY_OUNCE_TO_GRAMS;
    const lkrPricePerPawan = lkrPricePerGram * GRAMS_PER_PAWAN;

    const analyses = [
      "Gold prices are expected to remain stable with slight upward momentum due to ongoing geopolitical tensions and central bank buying activity.",
      "Technical indicators suggest a consolidation phase. The USD/LKR rate stability supports current price levels in the local market.",
      "Market sentiment remains bullish as inflation concerns persist. Safe-haven demand continues to support gold prices globally.",
      "Oil price fluctuations may impact short-term movements. Overall trend remains positive for precious metals.",
    ];

    const newPrediction: Prediction = {
      predictedUsd,
      lkrPawan: lkrPricePerPawan,
      lkrGram: lkrPricePerGram,
      analysis: analyses[Math.floor(Math.random() * analyses.length)],
      timestamp: new Date(),
    };

    setPrediction(newPrediction);
    setStatus('Ready');
    setIsLoading(false);
    
    toast({
      title: "Prediction Generated",
      description: `24h forecast: Rs. ${lkrPricePerPawan.toLocaleString(undefined, { maximumFractionDigits: 0 })} / Pawan`,
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
        <header className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                G0LD VISION <span className="text-primary">-See the future of GOLD price-</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Sri Lankan Market Price Predictor
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRefreshRates}
            disabled={isFetching}
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="font-semibold">Sync Rates</span>
          </button>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card p-6">
              <h2 className="stat-label mb-5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Market Inputs
              </h2>
              <div className="space-y-5">
                <MarketInput
                  label="Gold Price (USD/oz)"
                  value={marketData.goldUsd}
                  onChange={(v) => setMarketData(p => ({ ...p, goldUsd: v }))}
                  icon="dollar"
                />
                <MarketInput
                  label="USD / LKR Rate"
                  value={marketData.usdLkr}
                  onChange={(v) => setMarketData(p => ({ ...p, usdLkr: v }))}
                  icon="exchange"
                />
                <MarketInput
                  label="Brent Oil (USD)"
                  value={marketData.oilPrice}
                  onChange={(v) => setMarketData(p => ({ ...p, oilPrice: v }))}
                  icon="oil"
                />
                <MarketInput
                  label="Inflation Rate (%)"
                  value={marketData.inflation}
                  onChange={(v) => setMarketData(p => ({ ...p, inflation: v }))}
                  icon="inflation"
                />
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
                  <span>Analyzing Market...</span>
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
