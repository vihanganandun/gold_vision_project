import { Coins, Save, Sparkles } from 'lucide-react';

interface PredictionData {
  predictedUsdPerOz: number;
  lkrPerPawan22K: number;
  lkrPerGram22K: number;
  analysis: string;
  timestamp: Date;
}

interface PredictionCardProps {
  prediction: PredictionData | null;
  onSave: () => void;
}

export const PredictionCard = ({ prediction, onSave }: PredictionCardProps) => {
  if (!prediction) {
    return (
      <div className="h-full min-h-[320px] flex flex-col items-center justify-center glass-card border-dashed border-2 border-border/30 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <Coins className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <p className="text-muted-foreground text-sm">
          Enter market data and click<br />
          <span className="text-primary font-semibold">Predict Now</span> to generate forecast
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card-elevated bg-gold-subtle overflow-hidden animate-scale-in gold-glow">
      {/* Header with save button */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="stat-label text-primary">AI Prediction</span>
        </div>
        <button
          onClick={onSave}
          className="p-2.5 bg-secondary/80 hover:bg-secondary rounded-xl transition-colors group"
          title="Save prediction"
        >
          <Save className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Main price display */}
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="stat-value text-foreground">
              Rs. {prediction.lkrPerPawan22K.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Per Pawan (8g) • Rs. {prediction.lkrPerGram22K.toLocaleString(undefined, { maximumFractionDigits: 2 })} / gram
          </p>
        </div>

        {/* USD Reference */}
        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="stat-label">USD Price Target</p>
            <p className="font-bold font-mono text-foreground">${prediction.predictedUsdPerOz.toLocaleString()}</p>
          </div>
        </div>

        {/* Analysis */}
        <div className="p-4 bg-background/50 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            "{prediction.analysis}"
          </p>
        </div>

        {/* Timestamp */}
        <p className="text-[10px] text-muted-foreground/60 text-right">
          Generated at {prediction.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
