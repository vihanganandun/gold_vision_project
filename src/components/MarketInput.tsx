import { DollarSign, RefreshCw, Droplets, TrendingUp, LineChart, Coins } from 'lucide-react';

interface MarketInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: 'dollar' | 'exchange' | 'oil' | 'inflation' | 'spx' | 'silver';
}

const iconMap = {
  dollar: DollarSign,
  exchange: RefreshCw,
  oil: Droplets,
  inflation: TrendingUp,
  spx: LineChart,
  silver: Coins,
};

const iconColorMap = {
  dollar: 'text-primary',
  exchange: 'text-blue-400',
  oil: 'text-orange-400',
  inflation: 'text-emerald-400',
  spx: 'text-purple-400',
  silver: 'text-gray-400',
};

export const MarketInput = ({ label, value, onChange, icon }: MarketInputProps) => {
  const Icon = iconMap[icon];
  const iconColor = iconColorMap[icon];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="stat-label">{label}</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="input-field font-mono"
        step="0.01"
      />
    </div>
  );
};
