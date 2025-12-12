export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MiningStats {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface PortfolioData {
  labels: string[];
  values: number[];
  colors: string[];
}

export const generateMiningChartData = (days: number = 30): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseValue = 0.00015;
    const variance = (Math.random() - 0.5) * 0.00003;
    const trend = (days - i) * 0.000001;

    data.push({
      date: date.toISOString().split('T')[0],
      value: baseValue + variance + trend,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }

  return data;
};

export const generateRevenueData = (days: number = 30): ChartDataPoint[] => {
  const btcPrice = 43500;
  const miningData = generateMiningChartData(days);

  return miningData.map(point => ({
    ...point,
    value: point.value * btcPrice
  }));
};

export const generateHashrateData = (days: number = 30): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  const baseHashrate = 50;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const variance = (Math.random() - 0.5) * 5;
    const upgrades = Math.floor((days - i) / 10) * 2;

    data.push({
      date: date.toISOString().split('T')[0],
      value: baseHashrate + variance + upgrades,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }

  return data;
};

export const generatePortfolioData = (balances: { [key: string]: number }): PortfolioData => {
  const prices: { [key: string]: number } = {
    BTC: 43500,
    ETH: 2300,
    SOL: 95,
    TRX: 0.12,
    XRP: 0.62,
    TYT: 0.05,
    USDT: 1
  };

  const colors: { [key: string]: string } = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#14F195',
    TRX: '#FF0013',
    XRP: '#23292F',
    TYT: '#D2A44C',
    USDT: '#26A17B'
  };

  const labels: string[] = [];
  const values: number[] = [];
  const chartColors: string[] = [];

  Object.entries(balances).forEach(([currency, balance]) => {
    if (balance > 0) {
      const usdValue = balance * (prices[currency] || 0);
      if (usdValue > 0.01) {
        labels.push(currency);
        values.push(usdValue);
        chartColors.push(colors[currency] || '#666666');
      }
    }
  });

  return { labels, values, colors: chartColors };
};

export const calculateRoi = (
  investment: number,
  dailyRevenue: number,
  maintenanceCost: number,
  days: number
): { roi: number; netProfit: number; breakEvenDays: number } => {
  const dailyProfit = dailyRevenue - maintenanceCost;
  const netProfit = dailyProfit * days;
  const roi = (netProfit / investment) * 100;
  const breakEvenDays = investment / dailyProfit;

  return {
    roi: Math.round(roi * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    breakEvenDays: Math.ceil(breakEvenDays)
  };
};

export const formatChartValue = (value: number, type: 'btc' | 'usd' | 'th' = 'usd'): string => {
  switch (type) {
    case 'btc':
      return `${value.toFixed(8)} BTC`;
    case 'th':
      return `${value.toFixed(2)} TH/s`;
    default:
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const getChartColors = (theme: 'success' | 'warning' | 'error' | 'info' = 'success') => {
  const themes = {
    success: {
      gradient: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.1)'],
      line: '#10B981',
      point: '#059669'
    },
    warning: {
      gradient: ['rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.1)'],
      line: '#F59E0B',
      point: '#D97706'
    },
    error: {
      gradient: ['rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.1)'],
      line: '#EF4444',
      point: '#DC2626'
    },
    info: {
      gradient: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.1)'],
      line: '#3B82F6',
      point: '#2563EB'
    }
  };

  return themes[theme];
};
