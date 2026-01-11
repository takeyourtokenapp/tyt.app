import { Vote, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: string;
  votes_for: number;
  votes_against: number;
  total_votes: number;
  end_date: string;
  created_at: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: string, voteType: 'for' | 'against') => void;
  userVotingPower: number;
}

export default function ProposalCard({ proposal, onVote, userVotingPower }: ProposalCardProps) {
  const statusColors = {
    active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    passed: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    executed: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  const statusColor = statusColors[proposal.status as keyof typeof statusColors] || statusColors.active;

  const totalVotes = proposal.votes_for + proposal.votes_against;
  const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votes_against / totalVotes) * 100 : 0;

  const timeLeft = new Date(proposal.end_date).getTime() - Date.now();
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
  const hoursLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  const isActive = proposal.status === 'active';

  return (
    <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/20 rounded-xl p-6 hover:border-gold-500/40 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {proposal.status}
            </span>
            {isActive && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{daysLeft}d {hoursLeft}h left</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {proposal.description}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">For: {forPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Against: {againstPercentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="relative h-3 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
            style={{ width: `${forPercentage}%` }}
          />
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
            style={{ width: `${againstPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{proposal.votes_for.toLocaleString()} votes</span>
          <span>{totalVotes.toLocaleString()} total votes</span>
          <span>{proposal.votes_against.toLocaleString()} votes</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
        <span>Proposed by: {proposal.proposer}</span>
        <span>•</span>
        <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
      </div>

      {isActive && userVotingPower > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onVote(proposal.id, 'for')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-lg font-medium transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Vote For
          </button>
          <button
            onClick={() => onVote(proposal.id, 'against')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-all"
          >
            <XCircle className="w-4 h-4" />
            Vote Against
          </button>
        </div>
      ) : !isActive ? (
        <div className="bg-navy-700/50 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-400">Voting has ended</p>
        </div>
      ) : (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
          <p className="text-sm text-yellow-400">You need veTYT tokens to vote</p>
        </div>
      )}
    </div>
  );
}
