import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  question: string;
  context?: {
    user_level?: number;
    user_xp?: number;
    current_lesson?: string;
    current_track?: string;
    [key: string]: any;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { question, context }: RequestBody = await req.json();

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = generateAoiResponse(question, context);

    return new Response(
      JSON.stringify({
        response,
        context: {
          level: context?.user_level || 1,
          timestamp: new Date().toISOString(),
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in aoi-chat:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateAoiResponse(question: string, context?: any): string {
  const q = question.toLowerCase();

  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return `Hi there! I'm Aoi, your learning companion at TYT Academy. I'm here to help you understand blockchain, cryptocurrency mining, and our ecosystem. What would you like to explore today?`;
  }

  if (q.includes("mining") || q.includes("miner") || q.includes("nft")) {
    return `Great question about mining! In TYT, mining works through NFT miners that generate real Bitcoin rewards daily. Each NFT miner has:

• **Hash Power (TH/s)**: Higher = more rewards
• **Efficiency (W/TH)**: Lower = less electricity cost
• **Region**: Affects electricity rates
• **Maintenance**: Paid in TYT tokens (with discounts!)

Your miners work 24/7, and you can track earnings in real-time. Want to know more about a specific aspect?`;
  }

  if (q.includes("tyt") || q.includes("token")) {
    return `TYT is our utility token on Solana! Here's what makes it special:

• **Pay Maintenance**: Use TYT to pay for miner upkeep and get up to 20% discount
• **Marketplace**: Buy and sell miners using TYT
• **Governance**: Vote on platform decisions with veTYT
• **Burn Mechanism**: Every transaction burns TYT, reducing supply
• **Charity**: Part of every fee supports children's brain cancer research

The more TYT you hold and use, the more benefits you unlock!`;
  }

  if (q.includes("reward") || q.includes("earning") || q.includes("profit")) {
    return `Your mining rewards are calculated daily based on:

1. **Gross BTC**: Total mining output from your hash power
2. **Electricity**: Deducted based on your miner's efficiency
3. **Service Fee**: Small platform maintenance fee
4. **Discounts**: Applied if you pay with TYT or have VIP status
5. **Net BTC**: What you actually earn!

You can withdraw anytime or auto-reinvest to compound your earnings. Check your Dashboard to see today's rewards!`;
  }

  if (q.includes("academy") || q.includes("learn") || q.includes("education")) {
    return `Welcome to the TYT Academy! We offer structured learning tracks:

📚 **Beginner**: Crypto basics, wallet security, blockchain fundamentals
🔍 **Intermediate**: Mining economics, DeFi, smart contracts
🏗️ **Advanced**: Technical analysis, governance, protocol design

Complete lessons to earn XP, level up your Aoi companion (that's me!), and earn certificates. Your progress is saved on-chain as Soulbound NFTs!`;
  }

  if (q.includes("foundation") || q.includes("charity") || q.includes("cancer")) {
    return `I'm proud to tell you about the TYT Children's Brain Cancer Research & Support Foundation! 💙

Every transaction in TYT automatically contributes to:
• Medical research for childhood brain tumors
• Support for affected families
• Clinical equipment for hospitals
• Global partnerships with leading institutions

You can see transparent reports on our Foundation page. By using TYT, you're directly helping save children's lives. That's what makes this project truly special.`;
  }

  if (q.includes("level") || q.includes("xp") || q.includes("rank")) {
    const level = context?.user_level || 1;
    const xp = context?.user_xp || 0;

    return `You're currently at Level ${level} with ${xp} XP! Here's how progression works:

🦉 **Owl Ranks**:
• Worker (0-499 XP)
• Academic (500-1999 XP)
• Diplomat (2000-4999 XP)
• Peacekeeper (5000-9999 XP)
• Warrior (10000+ XP)

Earn XP by:
✓ Completing lessons
✓ Passing quizzes
✓ Daily platform activity
✓ Contributing to the community

Keep learning and you'll unlock new features and rewards!`;
  }

  if (q.includes("how") || q.includes("what") || q.includes("why") || q.includes("when")) {
    return `That's a great question! While I'm still learning (this is Phase 2 of my development), I can help you with:

• **Mining basics**: How NFT miners work and generate rewards
• **TYT Token**: Utility, tokenomics, and benefits
• **Platform features**: Marketplace, governance, staking
• **Academy**: Learning tracks and progression
• **Foundation**: Our charitable mission

Could you be more specific about what you'd like to know? Or try exploring the Academy lessons for detailed explanations!`;
  }

  return `Thanks for your question! I'm here to help you understand TYT's ecosystem.

I can explain:
• ⛏️ Mining and NFT miners
• 🪙 TYT token and utilities
• 📚 Academy tracks and learning
• 💙 Our charitable foundation
• 🎯 Rewards and progression

What would you like to explore first?`;
}
