import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatTokenAmount } from '@/utils/pumpFun';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookWidgetProps {
  currentPrice: number;
}

export default function OrderBookWidget({ currentPrice }: OrderBookWidgetProps) {
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    generateMockOrderBook();
    const interval = setInterval(generateMockOrderBook, 5000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const generateMockOrderBook = () => {
    const generateOrders = (basePrice: number, isBuy: boolean, count: number = 10): OrderBookEntry[] => {
      const orders: OrderBookEntry[] = [];
      let cumulativeTotal = 0;

      for (let i = 0; i < count; i++) {
        const priceVariation = isBuy
          ? 1 - (i * 0.005) - Math.random() * 0.002
          : 1 + (i * 0.005) + Math.random() * 0.002;

        const price = basePrice * priceVariation;
        const amount = Math.random() * 100000 + 10000;
        cumulativeTotal += amount;

        orders.push({
          price,
          amount,
          total: cumulativeTotal,
        });
      }

      return orders;
    };

    setBuyOrders(generateOrders(currentPrice, true));
    setSellOrders(generateOrders(currentPrice, false));
  };

  const maxTotal = Math.max(
    ...buyOrders.map((o) => o.total),
    ...sellOrders.map((o) => o.total)
  );

  const OrderRow = ({ order, isBuy }: { order: OrderBookEntry; isBuy: boolean }) => {
    const widthPercent = (order.total / maxTotal) * 100;

    return (
      <div className="relative h-6 overflow-hidden group hover:bg-tertiary/30 transition-colors cursor-pointer">
        <div
          className={`absolute top-0 bottom-0 right-0 ${
            isBuy ? 'bg-green-500/10' : 'bg-red-500/10'
          } transition-all duration-300`}
          style={{ width: `${widthPercent}%` }}
        />
        <div className="relative z-10 grid grid-cols-3 gap-2 px-3 py-1 text-xs">
          <div
            className={`text-right font-mono ${
              isBuy
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            ${order.price.toFixed(8)}
          </div>
          <div className="text-right text-primary-text font-mono">
            {formatTokenAmount(order.amount, 0)}
          </div>
          <div className="text-right text-tertiary-text font-mono">
            {formatTokenAmount(order.total, 0)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-secondary rounded-xl border border-secondary p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-primary-text">Order Book</h3>
        </div>
        <div className="text-xs text-tertiary-text">Real-time</div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-medium text-tertiary-text border-b border-secondary mb-2">
        <div className="text-right">Price (USD)</div>
        <div className="text-right">Amount (TYT)</div>
        <div className="text-right">Total</div>
      </div>

      <div className="space-y-px mb-4">
        <div className="text-xs text-tertiary-text px-3 py-1 flex items-center gap-2">
          <TrendingDown className="w-3 h-3 text-red-500 dark:text-red-400" />
          <span>Sell Orders</span>
        </div>
        {sellOrders.slice(0, 8).reverse().map((order, idx) => (
          <OrderRow key={`sell-${idx}`} order={order} isBuy={false} />
        ))}
      </div>

      <div className="my-3 px-3 py-3 bg-tertiary/30 rounded-lg">
        <div className="text-xs text-tertiary-text mb-1">Current Price</div>
        <div className="text-xl font-bold text-primary-text font-mono">
          ${currentPrice.toFixed(8)}
        </div>
      </div>

      <div className="space-y-px">
        <div className="text-xs text-tertiary-text px-3 py-1 flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-green-500 dark:text-green-400" />
          <span>Buy Orders</span>
        </div>
        {buyOrders.slice(0, 8).map((order, idx) => (
          <OrderRow key={`buy-${idx}`} order={order} isBuy={true} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="p-2 bg-green-500/5 rounded-lg border border-green-500/20">
          <div className="text-tertiary-text mb-1">Total Buy Volume</div>
          <div className="font-bold text-green-500 dark:text-green-400">
            {formatTokenAmount(buyOrders.reduce((sum, o) => sum + o.amount, 0), 0)} TYT
          </div>
        </div>
        <div className="p-2 bg-red-500/5 rounded-lg border border-red-500/20">
          <div className="text-tertiary-text mb-1">Total Sell Volume</div>
          <div className="font-bold text-red-500 dark:text-red-400">
            {formatTokenAmount(sellOrders.reduce((sum, o) => sum + o.amount, 0), 0)} TYT
          </div>
        </div>
      </div>
    </div>
  );
}
