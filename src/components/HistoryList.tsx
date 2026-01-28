import { History, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  lkrPawan: number;
  predictedUsd: number;
  date: Date;
}

interface HistoryListProps {
  items: HistoryItem[];
  status: string;
}

export const HistoryList = ({ items, status }: HistoryListProps) => {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-secondary/30 border-b border-border flex justify-between items-center">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          Prediction History
        </h3>
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'Ready' ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`} />
          {status}
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-border/50 max-h-48 overflow-y-auto scrollbar-thin">
        {items.length > 0 ? (
          items.map((item) => (
            <div 
              key={item.id} 
              className="p-4 hover:bg-secondary/30 transition-colors flex justify-between items-center group"
            >
              <div>
                <p className="font-bold text-primary font-mono">
                  Rs. {item.lkrPawan.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                  <p className="text-[10px] text-muted-foreground/60">
                    {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-mono">${item.predictedUsd}</p>
                <p className="text-[10px] text-muted-foreground/60 uppercase">USD Target</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
              <History className="w-5 h-5 text-muted-foreground/30" />
            </div>
            <p className="text-xs text-muted-foreground/60">
              Your saved predictions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
