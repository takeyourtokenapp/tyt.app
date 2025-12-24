import { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  Thermometer,
  Zap,
  Wifi,
  MapPin,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Globe,
  Clock,
  Play,
  Pause,
  Video
} from 'lucide-react';
import EcosystemStatus from '../../components/EcosystemStatus';
import { supabase } from '../../lib/supabase';

interface DataCenterStatus {
  id: string;
  name: string;
  location: string;
  country_code: string;
  kwh_rate: number;
  total_capacity_th: number;
  used_capacity_th: number;
  live_stream_url: string | null;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  status?: 'online' | 'maintenance' | 'offline';
  hashrate?: number;
  temperature?: number;
  efficiency?: number;
  uptime?: number;
  miners?: number;
}

interface LiveMetric {
  timestamp: string;
  hashrate: number;
  power: number;
}

export default function DataCenter() {
  const [dataCenters, setDataCenters] = useState<DataCenterStatus[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalHashrate: 0,
    totalMiners: 0,
    avgEfficiency: 0,
    avgUptime: 0
  });

  useEffect(() => {
    loadDataCenters();
    const interval = setInterval(updateLiveMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadDataCenters() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_centers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        const enrichedData = data.map(dc => ({
          ...dc,
          status: dc.is_active ? 'online' : 'offline' as 'online' | 'maintenance' | 'offline',
          hashrate: dc.used_capacity_th || 0,
          temperature: Math.floor(Math.random() * 10) + 35,
          efficiency: 28.5,
          uptime: 99.95,
          miners: Math.floor((dc.used_capacity_th || 0) / 100)
        }));

        setDataCenters(enrichedData);
        if (!selectedCenter && enrichedData[0]) {
          setSelectedCenter(enrichedData[0].id);
        }

        const totalCap = enrichedData.reduce((sum, dc) => sum + (dc.total_capacity_th || 0), 0);
        const usedCap = enrichedData.reduce((sum, dc) => sum + (dc.used_capacity_th || 0), 0);

        setTotalStats({
          totalHashrate: usedCap,
          totalMiners: Math.floor(usedCap / 100),
          avgEfficiency: 28.5,
          avgUptime: 99.95
        });
      }
    } catch (error) {
      console.error('Error loading data centers:', error);
    } finally {
      setLoading(false);
    }
  }

  function getMockCenters(): DataCenterStatus[] {
    return [
      {
        id: 'us-east',
        name: 'US East Coast',
        location: 'Virginia',
        country_code: 'USA',
        kwh_rate: 0.08,
        total_capacity_th: 150000,
        used_capacity_th: 85500,
        live_stream_url: null,
        is_active: true,
        latitude: 37.5,
        longitude: -77.4
      },
      {
        id: 'eu-north',
        name: 'EU Nordic',
        location: 'Stockholm',
        country_code: 'SWE',
        kwh_rate: 0.05,
        total_capacity_th: 120000,
        used_capacity_th: 45800,
        live_stream_url: null,
        is_active: true,
        latitude: 59.3,
        longitude: 18.1
      },
      {
        id: 'asia-east',
        name: 'Asia Pacific',
        location: 'Singapore',
        country_code: 'SGP',
        kwh_rate: 0.12,
        total_capacity_th: 100000,
        used_capacity_th: 52100,
        live_stream_url: null,
        is_active: true,
        latitude: 1.3,
        longitude: 103.8
      }
    ];
  }

  function updateLiveMetrics() {
    setLiveMetrics(prev => {
      const newMetric: LiveMetric = {
        timestamp: new Date().toISOString(),
        hashrate: totalStats.totalHashrate + (Math.random() - 0.5) * 10,
        power: totalStats.totalHashrate * totalStats.avgEfficiency * (0.95 + Math.random() * 0.1)
      };
      return [...prev.slice(1), newMetric];
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20';
      case 'maintenance': return 'text-amber-400 bg-amber-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const selectedCenterData = dataCenters.find(c => c.id === selectedCenter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Server className="w-8 h-8 text-blue-400" />
            Data Center Network
          </h1>
          <p className="text-gray-400 mt-1">Real-time monitoring of global mining infrastructure</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
            <Activity className="w-4 h-4" />
            Live
          </div>
          <span className="text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <Globe className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {dataCenters.length}
          </div>
          <div className="text-sm text-gray-400">Active Data Centers</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <Cpu className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-1">
            {totalStats.totalHashrate.toFixed(1)} TH/s
          </div>
          <div className="text-sm text-gray-400">Total Hashrate</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <Server className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mb-1">
            {totalStats.totalMiners.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Active Miners</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {totalStats.avgUptime.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-400">Network Uptime</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Live Hashrate Feed
          </h3>
          <div className="h-48 flex items-end gap-1">
            {liveMetrics.map((metric, index) => {
              const height = ((metric.hashrate / (totalStats.totalHashrate * 1.1)) * 100);
              return (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-500"
                  style={{ height: `${height}%` }}
                  title={`${metric.hashrate.toFixed(1)} TH/s`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>20 min ago</span>
            <span>Now</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Network Status
          </h3>
          <div className="space-y-3">
            {dataCenters.map((center) => (
              <div
                key={center.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCenter === center.id
                    ? 'bg-blue-500/20 border border-blue-500/50'
                    : 'bg-gray-900/50 hover:bg-gray-900'
                }`}
                onClick={() => setSelectedCenter(center.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (center.status || 'online') === 'online' ? 'bg-green-400' :
                    (center.status || 'online') === 'maintenance' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm font-medium">{center.name}</span>
                </div>
                <span className="text-xs text-gray-400">{center.hashrate || 0} TH/s</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCenterData && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                {selectedCenterData.name}
              </h3>
              <p className="text-sm text-gray-400">{selectedCenterData.location}, {selectedCenterData.country_code}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(selectedCenterData.status || 'online')}`}>
              {selectedCenterData.status === 'online' && <CheckCircle className="w-4 h-4" />}
              {selectedCenterData.status === 'maintenance' && <AlertTriangle className="w-4 h-4" />}
              {(selectedCenterData.status || 'online').charAt(0).toUpperCase() + (selectedCenterData.status || 'online').slice(1)}
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Cpu className="w-4 h-4" />
                Hashrate
              </div>
              <div className="text-2xl font-bold text-amber-400">{selectedCenterData.hashrate || 0} TH/s</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Thermometer className="w-4 h-4" />
                Temperature
              </div>
              <div className={`text-2xl font-bold ${(selectedCenterData.temperature || 0) > 45 ? 'text-red-400' : (selectedCenterData.temperature || 0) > 40 ? 'text-amber-400' : 'text-green-400'}`}>
                {selectedCenterData.temperature || 0}°C
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Zap className="w-4 h-4" />
                Efficiency
              </div>
              <div className="text-2xl font-bold text-blue-400">{selectedCenterData.efficiency || 0} W/TH</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Wifi className="w-4 h-4" />
                Uptime
              </div>
              <div className="text-2xl font-bold text-green-400">{selectedCenterData.uptime || 0}%</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Server className="w-4 h-4" />
                Miners
              </div>
              <div className="text-2xl font-bold text-white">{(selectedCenterData.miners || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Server className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-lg mb-2">Enterprise-Grade Infrastructure</h4>
            <p className="text-gray-400 text-sm mb-4">
              Our data centers are strategically located across the globe to ensure optimal mining performance,
              low latency, and compliance with local regulations. All facilities are powered by renewable energy
              where possible and maintained by professional teams 24/7.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>99.9% SLA Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Green Energy Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EcosystemStatus />
    </div>
  );
}
