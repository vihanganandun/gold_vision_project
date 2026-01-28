import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartDataPoint {
  name: string;
  price: number;
}

interface PriceChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-primary/30">
        <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
        <p className="font-bold text-primary font-mono">
          Rs. {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const PriceChart = ({ data }: PriceChartProps) => {
  if (data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-muted-foreground/40">
        <TrendingUp className="w-8 h-8 mb-2" />
        <p className="text-xs">No historical data yet</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(217 33% 20%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(217 33% 20%)' }}
            tickLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="hsl(43 96% 56%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(43 96% 56%)', strokeWidth: 0, r: 4 }}
            activeDot={{ fill: 'hsl(43 100% 70%)', strokeWidth: 0, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
