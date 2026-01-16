import { useState, useEffect } from 'react';
import { Eye, Shield, CheckCircle, Clock, Hash, ExternalLink, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface OrbitalEvent {
  id: string;
  event_type: string;
  subject_type: string;
  subject_id: string;
  witness_hash: string;
  block_number: number | null;
  blockchain: string | null;
  verified: boolean;
  metadata: any;
  created_at: string;
}

const EVENT_TYPES = [
  'all',
  'reward_snapshot',
  'burn_event',
  'foundation_report',
  'maintenance_payment',
  'marketplace_sale'
];

export default function Orbital() {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrbitalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0
  });

  useEffect(() => {
    loadOrbitalEvents();
  }, [filterType]);

  async function loadOrbitalEvents() {
    try {
      setLoading(true);

      // Use orbital_events table for witness data
      let query = supabase
        .from('orbital_events')
        .select('*')
        .order('signed_at', { ascending: false })
        .limit(50);

      if (filterType !== 'all') {
        query = query.eq('event_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mappedEvents: OrbitalEvent[] = (data || []).map((event) => ({
        id: event.id,
        event_type: event.event_type,
        subject_type: event.entity_type,
        subject_id: event.entity_id,
        witness_hash: event.signed_hash || '',
        block_number: event.metadata?.block_number || null,
        blockchain: event.metadata?.blockchain || null,
        verified: !!event.signature,
        metadata: event.metadata || {},
        created_at: event.signed_at
      }));

      setEvents(mappedEvents);

      setStats({
        total: mappedEvents.length,
        verified: mappedEvents.filter(e => e.verified).length,
        pending: mappedEvents.filter(e => !e.verified).length
      });
    } catch (error) {
      console.error('Failed to load orbital events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  function getEventIcon(type: string) {
    switch (type) {
      case 'reward_snapshot':
      case 'xp_gained':
        return <CheckCircle className="w-5 h-5" />;
      case 'burn_event':
        return <Shield className="w-5 h-5" />;
      case 'foundation_report':
        return <Eye className="w-5 h-5" />;
      default:
        return <Hash className="w-5 h-5" />;
    }
  }

  function getEventColor(type: string) {
    switch (type) {
      case 'reward_snapshot':
      case 'xp_gained':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400';
      case 'burn_event':
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400';
      case 'foundation_report':
        return 'from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-400';
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400';
    }
  }

  function formatEventType(type: string): string {
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/30 p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary-text">Orbital Layer</h1>
            <p className="text-secondary-text">Read-only witness and proof verification system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-tertiary-text mb-2">
              <Hash className="w-4 h-4" />
              Total Events
            </div>
            <div className="text-2xl font-bold text-primary-text">{stats.total}</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-tertiary-text mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Verified
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.verified}</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-tertiary-text mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending
            </div>
            <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
          </div>
        </div>
      </div>

      <div className="bg-secondary rounded-xl border border-secondary p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary-text">Event Log</h2>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-tertiary-text" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-tertiary border border-secondary rounded-lg text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatEventType(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Clock className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-tertiary-text">
            <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No orbital events found</p>
            <p className="text-sm mt-2">Events will appear here as they are witnessed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`
                  bg-gradient-to-br rounded-lg border p-4
                  transition-all hover:scale-[1.01]
                  ${getEventColor(event.event_type)}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/50 rounded-lg">
                      {getEventIcon(event.event_type)}
                    </div>
                    <div>
                      <div className="font-semibold text-primary-text">
                        {formatEventType(event.event_type)}
                      </div>
                      <div className="text-xs text-tertiary-text">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {event.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-tertiary-text">Witness Hash:</span>
                    <div className="font-mono text-xs text-secondary-text truncate">
                      {event.witness_hash || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-tertiary-text">Subject ID:</span>
                    <div className="font-mono text-xs text-secondary-text truncate">
                      {event.subject_id}
                    </div>
                  </div>
                </div>

                {event.blockchain && event.block_number && (
                  <div className="mt-3 pt-3 border-t border-secondary/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-tertiary-text">
                        Block: {event.block_number} on {event.blockchain}
                      </span>
                      <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
                        <ExternalLink className="w-3 h-3" />
                        View on Explorer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-secondary rounded-xl border border-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-primary-text">About Orbital Layer</h3>
        </div>
        <div className="space-y-3 text-sm text-secondary-text">
          <p>
            The Orbital Layer is a read-only witness system that provides cryptographic proof of platform events.
            All events are recorded with immutable hashes for transparency and verification.
          </p>
          <p>
            <strong className="text-primary-text">Key Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Reward snapshots with Merkle proofs</li>
            <li>Token burn event tracking</li>
            <li>Foundation donation verification</li>
            <li>Marketplace transaction witnesses</li>
            <li>Cross-chain event anchoring (coming soon)</li>
          </ul>
          <p className="text-xs text-tertiary-text">
            Note: The Orbital Layer does not control funds or execute transactions. It only witnesses and verifies events.
          </p>
        </div>
      </div>
    </div>
  );
}
