import { useState } from 'react';
import { Shield, Check, Copy, Download, ExternalLink, Hash, TreePine } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface MerkleProofData {
  leafHash: string;
  proof: string[];
  root: string;
  index: number;
  verified: boolean;
  epochOrDate?: string;
  rewardAmount?: string;
  minerId?: string;
}

interface EnhancedMerkleProofViewerProps {
  data?: MerkleProofData;
  loading?: boolean;
}

export function EnhancedMerkleProofViewer({ data, loading = false }: EnhancedMerkleProofViewerProps) {
  const { showToast } = useToast();
  const [expandedProof, setExpandedProof] = useState(false);

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, 'success');
    } catch (error) {
      showToast('Failed to copy', 'error');
    }
  }

  function downloadProofJSON() {
    if (!data) return;

    const proofObject = {
      leafHash: data.leafHash,
      proof: data.proof,
      root: data.root,
      index: data.index,
      verified: data.verified,
      epochOrDate: data.epochOrDate,
      rewardAmount: data.rewardAmount,
      minerId: data.minerId,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(proofObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merkle-proof-${data.index}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Proof exported successfully', 'success');
  }

  function truncateHash(hash: string, startChars = 8, endChars = 8): string {
    if (hash.length <= startChars + endChars) return hash;
    return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
  }

  if (loading) {
    return (
      <div className="bg-secondary rounded-xl border border-secondary p-6">
        <div className="flex items-center justify-center h-48">
          <Shield className="w-8 h-8 text-purple-500 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-secondary rounded-xl border border-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-primary-text">Merkle Proof Viewer</h3>
        </div>
        <div className="text-center py-12 text-tertiary-text">
          <TreePine className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No proof data available</p>
          <p className="text-sm mt-2">Select a reward to view its proof</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-xl border border-secondary p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            data.verified
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
              : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
          }`}>
            <Shield className={`w-6 h-6 ${data.verified ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-primary-text">Merkle Proof</h3>
            <p className="text-xs text-tertiary-text">Cryptographic verification of reward</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadProofJSON}
            className="p-2 bg-tertiary hover:bg-secondary rounded-lg transition-colors"
            title="Download proof as JSON"
          >
            <Download className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {data.verified && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-semibold text-green-400">Proof Verified</div>
              <div className="text-xs text-secondary-text">
                This reward has been cryptographically verified on-chain
              </div>
            </div>
          </div>
        </div>
      )}

      {data.rewardAmount && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-tertiary/50 rounded-lg p-4">
            <div className="text-xs text-tertiary-text mb-1">Reward Amount</div>
            <div className="font-semibold text-primary-text">{data.rewardAmount} BTC</div>
          </div>
          {data.epochOrDate && (
            <div className="bg-tertiary/50 rounded-lg p-4">
              <div className="text-xs text-tertiary-text mb-1">Date/Epoch</div>
              <div className="font-semibold text-primary-text">{data.epochOrDate}</div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-text">Merkle Root</span>
            <button
              onClick={() => copyToClipboard(data.root, 'Root hash')}
              className="p-1 hover:bg-tertiary rounded transition-colors"
            >
              <Copy className="w-3 h-3 text-tertiary-text" />
            </button>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-3">
            <code className="text-xs font-mono text-purple-400 break-all">{data.root}</code>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-text">Leaf Hash (Your Reward)</span>
            <button
              onClick={() => copyToClipboard(data.leafHash, 'Leaf hash')}
              className="p-1 hover:bg-tertiary rounded transition-colors"
            >
              <Copy className="w-3 h-3 text-tertiary-text" />
            </button>
          </div>
          <div className="bg-tertiary/50 border border-secondary rounded-lg p-3">
            <code className="text-xs font-mono text-secondary-text break-all">{data.leafHash}</code>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-text">Proof Path ({data.proof.length} steps)</span>
            <button
              onClick={() => setExpandedProof(!expandedProof)}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              {expandedProof ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <div className="space-y-2">
            {(expandedProof ? data.proof : data.proof.slice(0, 2)).map((hash, idx) => (
              <div key={idx} className="bg-tertiary/50 border border-secondary rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-tertiary-text">Step {idx + 1}</span>
                  <button
                    onClick={() => copyToClipboard(hash, `Step ${idx + 1}`)}
                    className="p-1 hover:bg-secondary rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-tertiary-text" />
                  </button>
                </div>
                <code className="text-xs font-mono text-secondary-text break-all">{hash}</code>
              </div>
            ))}
            {!expandedProof && data.proof.length > 2 && (
              <div className="text-center text-xs text-tertiary-text py-2">
                +{data.proof.length - 2} more steps
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-tertiary/50 rounded-lg p-3">
            <div className="text-xs text-tertiary-text mb-1">Leaf Index</div>
            <div className="font-mono font-semibold text-primary-text">{data.index}</div>
          </div>
          <div className="bg-tertiary/50 rounded-lg p-3">
            <div className="text-xs text-tertiary-text mb-1">Tree Depth</div>
            <div className="font-mono font-semibold text-primary-text">{data.proof.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-tertiary/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Hash className="w-4 h-4 text-purple-400 mt-0.5" />
          <div className="text-xs text-secondary-text">
            <p className="mb-2">
              <strong className="text-primary-text">What is a Merkle Proof?</strong>
            </p>
            <p>
              A Merkle proof is a cryptographic verification that proves your reward is included in the official
              reward tree without revealing all rewards. It uses a series of hash calculations to verify authenticity.
            </p>
          </div>
        </div>
      </div>

      {data.verified && (
        <button className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-purple-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Verify on Blockchain Explorer
        </button>
      )}
    </div>
  );
}
