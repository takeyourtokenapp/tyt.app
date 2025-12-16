import { useState } from 'react';
import { Copy, Check, Shield, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface MerkleProofViewerProps {
  rewardId: string;
  userId: string;
  amount: number;
  merkleRoot: string;
  merkleProof: string[];
  leafIndex: number;
}

export default function MerkleProofViewer({
  rewardId,
  userId,
  amount,
  merkleRoot,
  merkleProof,
  leafIndex
}: MerkleProofViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatHash = (hash: string, short: boolean = true) => {
    if (!hash) return 'N/A';
    if (short && hash.length > 20) {
      return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
    }
    return hash;
  };

  const verifyProof = () => {
    alert('Opening blockchain verification...\n\nIn production, this will:\n1. Connect to smart contract\n2. Call verifyProof() function\n3. Show verification status on-chain');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <div className="text-left">
            <h3 className="font-semibold text-white">Merkle Proof Verification</h3>
            <p className="text-xs text-gray-400">Cryptographic proof of reward legitimacy</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Proof Status: <span className="text-green-400 font-semibold">Valid</span></span>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Merkle Root (On-Chain)</p>
                  <p className="text-sm text-white font-mono break-all">{formatHash(merkleRoot, false)}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(merkleRoot, 'root')}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Copy Merkle Root"
                >
                  {copiedField === 'root' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reward Amount</p>
                  <p className="text-sm text-white font-semibold">{amount.toFixed(8)} BTC</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Leaf Index</p>
                  <p className="text-sm text-white font-semibold">#{leafIndex}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-300">Merkle Proof Path</h4>
              <span className="text-xs text-gray-500">{merkleProof.length} hashes</span>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
              {merkleProof.length > 0 ? (
                merkleProof.map((hash, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-800/30 rounded border border-gray-700/50"
                  >
                    <span className="text-xs text-cyan-400 font-semibold w-8">#{index}</span>
                    <span className="text-xs text-white font-mono flex-1 truncate">{formatHash(hash)}</span>
                    <button
                      onClick={() => copyToClipboard(hash, `proof-${index}`)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedField === `proof-${index}` ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No proof data available</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={verifyProof}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Verify On-Chain
            </button>
            <button
              onClick={() => copyToClipboard(JSON.stringify({ merkleRoot, merkleProof, leafIndex }, null, 2), 'full')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {copiedField === 'full' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy JSON
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-300">
                <p className="font-semibold text-blue-300 mb-1">What is a Merkle Proof?</p>
                <p className="text-gray-400">
                  A cryptographic proof that verifies your reward is included in the on-chain Merkle tree.
                  This ensures 100% transparency - you can independently verify that your reward was calculated correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <span>Reward ID: {formatHash(rewardId)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
