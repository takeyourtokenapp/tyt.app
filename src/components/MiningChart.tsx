import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface MiningChartProps {
  data: ChartDataPoint[];
  title: string;
  valueType?: 'btc' | 'usd' | 'th';
  color?: 'green' | 'blue' | 'amber' | 'purple';
  height?: number;
  showTrend?: boolean;
}

export default function MiningChart({
  data,
  title,
  valueType = 'usd',
  color = 'green',
  height = 200,
  showTrend = true
}: MiningChartProps) {
  const colorSchemes = {
    green: {
      gradient: 'from-green-500/20 to-green-500/0',
      stroke: 'stroke-green-500',
      fill: 'fill-green-500',
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/50'
    },
    blue: {
      gradient: 'from-blue-500/20 to-blue-500/0',
      stroke: 'stroke-blue-500',
      fill: 'fill-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50'
    },
    amber: {
      gradient: 'from-amber-500/20 to-amber-500/0',
      stroke: 'stroke-amber-500',
      fill: 'fill-amber-500',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/50'
    },
    purple: {
      gradient: 'from-purple-500/20 to-purple-500/0',
      stroke: 'stroke-purple-500',
      fill: 'fill-purple-500',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/50'
    }
  };

  const colors = colorSchemes[color];

  const { chartPath, points, maxValue, minValue, trend, trendPercentage } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartPath: '', points: [], maxValue: 0, minValue: 0, trend: 0, trendPercentage: 0 };
    }

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 100;
    const chartHeight = 100;
    const padding = 5;
    const stepX = width / (data.length - 1);

    const normalizedPoints = data.map((point, index) => {
      const x = index * stepX;
      const normalizedValue = ((point.value - min) / range);
      const y = chartHeight - (normalizedValue * (chartHeight - padding * 2)) - padding;
      return { x, y, value: point.value };
    });

    const pathData = normalizedPoints.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x} ${point.y}`;
    }).join(' ');

    const areaPath = `${pathData} L ${width} ${chartHeight} L 0 ${chartHeight} Z`;

    const firstValue = data[0]?.value || 0;
    const lastValue = data[data.length - 1]?.value || 0;
    const trendValue = lastValue - firstValue;
    const trendPercent = firstValue !== 0 ? (trendValue / firstValue) * 100 : 0;

    return {
      chartPath: areaPath,
      points: normalizedPoints,
      maxValue: max,
      minValue: min,
      trend: trendValue,
      trendPercentage: trendPercent
    };
  }, [data]);

  const formatValue = (value: number): string => {
    switch (valueType) {
      case 'btc':
        return `${value.toFixed(8)} BTC`;
      case 'th':
        return `${value.toFixed(2)} TH/s`;
      default:
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const currentValue = data[data.length - 1]?.value || 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{formatValue(currentValue)}</p>
        </div>
        {showTrend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${colors.bg} border ${colors.border}`}>
            {trend >= 0 ? (
              <TrendingUp className={`w-4 h-4 ${colors.text}`} />
            ) : (
              <TrendingDown className={`w-4 h-4 ${colors.text}`} />
            )}
            <span className={`text-sm font-semibold ${colors.text}`}>
              {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`${colors.fill}`} stopOpacity="0.3" />
              <stop offset="100%" className={`${colors.fill}`} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={chartPath}
            fill={`url(#gradient-${color})`}
            className="transition-all duration-300"
          />

          <path
            d={chartPath.split(' L ')[0] + points.map(p => ` L ${p.x} ${p.y}`).join('')}
            fill="none"
            className={`${colors.stroke} transition-all duration-300`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              className={`${colors.fill} transition-all duration-300`}
            />
          ))}
        </svg>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs">
        <span className="text-gray-400">Min: {formatValue(minValue)}</span>
        <span className="text-gray-400">Max: {formatValue(maxValue)}</span>
      </div>
    </div>
  );
}

export function MiniChart({ data, color = 'green' }: { data: ChartDataPoint[]; color?: 'green' | 'blue' | 'amber' | 'purple' }) {
  const colors = {
    green: 'stroke-green-500 fill-green-500',
    blue: 'stroke-blue-500 fill-blue-500',
    amber: 'stroke-amber-500 fill-amber-500',
    purple: 'stroke-purple-500 fill-purple-500'
  };

  const { chartPath } = useMemo(() => {
    if (!data || data.length === 0) return { chartPath: '' };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 60;
    const height = 20;
    const stepX = width / (data.length - 1);

    const points = data.map((point, index) => {
      const x = index * stepX;
      const normalizedValue = ((point.value - min) / range);
      const y = height - (normalizedValue * height);
      return { x, y };
    });

    const pathData = points.map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ');

    return { chartPath: pathData };
  }, [data]);

  return (
    <svg viewBox="0 0 60 20" className="w-16 h-6">
      <path
        d={chartPath}
        fill="none"
        className={colors[color]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
