import { useState, useCallback } from 'react';
import { useAoi } from '../contexts/AoiContext';

export type ExplainSubjectType =
  | 'reward_calculation'
  | 'maintenance_fee'
  | 'fee_breakdown'
  | 'ledger_entry'
  | 'discount_applied'
  | 'merkle_proof'
  | 'foundation_contribution'
  | 'vip_benefit'
  | 'burn_event'
  | 'wallet_balance';

interface UseAoiExplainOptions {
  subjectType: ExplainSubjectType;
  subjectId?: string;
  contextData?: Record<string, any>;
}

export function useAoiExplain({ subjectType, subjectId, contextData }: UseAoiExplainOptions) {
  const { askAoi } = useAoi();
  const [isExplaining, setIsExplaining] = useState(false);

  const explain = useCallback(async () => {
    setIsExplaining(true);

    try {
      const question = generateExplainQuestion(subjectType, contextData);
      await askAoi(question, {
        type: 'explanation_request',
        subjectType,
        subjectId,
        contextData
      });
    } finally {
      setIsExplaining(false);
    }
  }, [askAoi, subjectType, subjectId, contextData]);

  return {
    explain,
    isExplaining
  };
}

function generateExplainQuestion(
  subjectType: ExplainSubjectType,
  contextData?: Record<string, any>
): string {
  const templates: Record<ExplainSubjectType, string> = {
    reward_calculation: `Explain how my BTC reward of ${contextData?.amount || '0'} was calculated. Include network difficulty, hashrate, and any fees.`,
    maintenance_fee: `Explain my maintenance fee of $${contextData?.amount || '0'}. Break down electricity costs, service fees, and any discounts applied.`,
    fee_breakdown: `Explain the fee breakdown: ${contextData?.total || '0'} total. Show me the 60/30/10 split (Protocol/Charity/Academy).`,
    ledger_entry: `Explain this ledger entry: ${contextData?.type || 'transaction'} of ${contextData?.amount || '0'}. What does this mean for my account?`,
    discount_applied: `Explain the discount I received: ${contextData?.percentage || '0'}% off. What factors contributed to this discount?`,
    merkle_proof: `Explain the Merkle proof for my reward. What is it and how does it verify my earnings?`,
    foundation_contribution: `Explain my contribution to the Children's Brain Cancer Foundation: $${contextData?.amount || '0'}. How was this calculated?`,
    vip_benefit: `Explain my VIP Level ${contextData?.level || '0'} benefits. What discounts and perks do I have?`,
    burn_event: `Explain this token burn event: ${contextData?.amount || '0'} TYT burned. Why does this happen and what does it mean?`,
    wallet_balance: `Explain my ${contextData?.currency || 'wallet'} balance of ${contextData?.amount || '0'}. Where did this come from?`
  };

  return templates[subjectType] || 'Can you explain this to me?';
}
