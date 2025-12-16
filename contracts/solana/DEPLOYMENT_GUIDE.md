# TYT Solana Programs Deployment Guide

Complete deployment guide for TYT Solana programs.

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.30.1
avm use 0.30.1

# Verify installations
solana --version
anchor --version
```

## Program: tyt_academy_sbt

### 1. Build

```bash
cd contracts/solana/tyt_academy_sbt
anchor build
```

### 2. Get Program ID

```bash
solana address -k target/deploy/tyt_academy_sbt-keypair.json
```

Update `declare_id!()` in `lib.rs` with the program ID.

### 3. Deploy to Devnet

```bash
# Configure Solana CLI for devnet
solana config set --url https://api.devnet.solana.com

# Create/check wallet
solana-keygen new -o ~/.config/solana/devnet.json
solana config set --keypair ~/.config/solana/devnet.json

# Airdrop SOL for deployment
solana airdrop 2

# Deploy
anchor deploy --provider.cluster devnet
```

### 4. Initialize Program

```bash
# Using Anchor CLI
anchor run initialize
```

Or via TypeScript:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TytAcademySbt } from "../target/types/tyt_academy_sbt";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const program = anchor.workspace.TytAcademySbt as Program<TytAcademySbt>;

// Derive config PDA
const [configPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("config")],
  program.programId
);

// Initialize with issuer authority
await program.methods
  .initialize(provider.wallet.publicKey)
  .accounts({
    config: configPDA,
    payer: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

console.log("Program initialized!");
```

### 5. Issue Test Certificate

```typescript
const courseId = new anchor.BN(1); // Bitcoin Basics course
const level = 1; // Beginner
const testUser = anchor.web3.Keypair.generate();

// Derive certificate PDA
const [certificatePDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("certificate"),
    testUser.publicKey.toBuffer(),
    courseId.toArrayLike(Buffer, "le", 8),
  ],
  program.programId
);

// Issue certificate
await program.methods
  .issueCertificate(courseId, level)
  .accounts({
    certificate: certificatePDA,
    config: configPDA,
    user: testUser.publicKey,
    issuer: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

console.log("Certificate issued to:", testUser.publicKey.toString());
console.log("Certificate PDA:", certificatePDA.toString());
```

### 6. Verify Certificate

```typescript
const isValid = await program.methods
  .verifyCertificate(courseId)
  .accounts({
    certificate: certificatePDA,
    user: testUser.publicKey,
  })
  .view();

console.log("Certificate valid:", isValid);
```

## Deploy to Mainnet

### 1. Prepare Mainnet Wallet

```bash
# Create mainnet wallet (SECURE THIS!)
solana-keygen new -o ~/.config/solana/mainnet.json

# Configure for mainnet
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair ~/.config/solana/mainnet.json

# Fund wallet (you'll need actual SOL)
# ~2-5 SOL recommended for program deployment
```

### 2. Verifiable Build

```bash
cd contracts/solana/tyt_academy_sbt

# Clean build
anchor clean

# Verifiable build
anchor build --verifiable

# Deploy
anchor deploy --provider.cluster mainnet
```

### 3. Verify Deployment

```bash
# Get program account info
solana program show <PROGRAM_ID>

# Verify program is deployed
solana account <PROGRAM_ID>
```

### 4. Initialize Mainnet Program

```typescript
// Use production issuer authority wallet
const PRODUCTION_ISSUER = new PublicKey("YOUR_PRODUCTION_ISSUER_PUBKEY");

await program.methods
  .initialize(PRODUCTION_ISSUER)
  .accounts({
    config: configPDA,
    payer: provider.wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

## Integration with TYT Backend

### Environment Variables

```env
# Solana RPC
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_CLUSTER=mainnet-beta

# Program IDs
ACADEMY_SBT_PROGRAM_ID=TYT11111111111111111111111111111111111111111

# Issuer Authority (SECURE!)
ISSUER_PRIVATE_KEY=base58_encoded_private_key
```

### Backend Service (Node.js)

```typescript
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import idl from "./tyt_academy_sbt.json";

class AcademySBTService {
  private connection: Connection;
  private program: Program;
  private issuer: Keypair;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL!);
    this.issuer = Keypair.fromSecretKey(
      anchor.utils.bytes.bs58.decode(process.env.ISSUER_PRIVATE_KEY!)
    );

    const provider = new anchor.AnchorProvider(
      this.connection,
      new anchor.Wallet(this.issuer),
      {}
    );

    this.program = new anchor.Program(
      idl,
      new PublicKey(process.env.ACADEMY_SBT_PROGRAM_ID!),
      provider
    );
  }

  async issueCertificate(
    userPubkey: PublicKey,
    courseId: number,
    level: number
  ) {
    const courseIdBN = new anchor.BN(courseId);

    const [certificatePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("certificate"),
        userPubkey.toBuffer(),
        courseIdBN.toArrayLike(Buffer, "le", 8),
      ],
      this.program.programId
    );

    const [configPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      this.program.programId
    );

    const tx = await this.program.methods
      .issueCertificate(courseIdBN, level)
      .accounts({
        certificate: certificatePDA,
        config: configPDA,
        user: userPubkey,
        issuer: this.issuer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return {
      signature: tx,
      certificatePDA: certificatePDA.toString(),
    };
  }

  async verifyCertificate(userPubkey: PublicKey, courseId: number) {
    const courseIdBN = new anchor.BN(courseId);

    const [certificatePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("certificate"),
        userPubkey.toBuffer(),
        courseIdBN.toArrayLike(Buffer, "le", 8),
      ],
      this.program.programId
    );

    try {
      const isValid = await this.program.methods
        .verifyCertificate(courseIdBN)
        .accounts({
          certificate: certificatePDA,
          user: userPubkey,
        })
        .view();

      return isValid;
    } catch {
      return false; // Certificate doesn't exist
    }
  }
}

export default AcademySBTService;
```

### Supabase Edge Function

```typescript
// supabase/functions/issue-certificate/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Connection, PublicKey } from "npm:@solana/web3.js@1.87.6";

serve(async (req) => {
  try {
    const { userId, courseId, level } = await req.json();

    // Get user's Solana wallet from Supabase
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("solana_wallet")
      .eq("id", userId)
      .single();

    if (!profile?.solana_wallet) {
      throw new Error("User has no Solana wallet");
    }

    // Call Solana program to issue certificate
    const sbService = new AcademySBTService();
    const result = await sbService.issueCertificate(
      new PublicKey(profile.solana_wallet),
      courseId,
      level
    );

    // Store certificate reference in Supabase
    await supabaseClient.from("academy_certificates").insert({
      user_id: userId,
      course_id: courseId,
      level,
      certificate_pda: result.certificatePDA,
      tx_signature: result.signature,
      issued_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

## Security Checklist

- [ ] Program ID updated in all files
- [ ] Issuer authority secured (hardware wallet recommended)
- [ ] Private keys never committed to git
- [ ] Mainnet wallet sufficiently funded
- [ ] Verifiable build completed
- [ ] Program initialized with correct authority
- [ ] Test certificates issued and verified
- [ ] Monitoring setup for program usage
- [ ] Backup of program keypair secured
- [ ] Authority upgrade path documented

## Cost Estimates

- **Program Deployment**: ~2-3 SOL (one-time)
- **Program Initialization**: ~0.001 SOL (one-time)
- **Certificate Issuance**: ~0.002 SOL per certificate
- **Certificate Verification**: Free (read-only)

## Monitoring

```bash
# Check program account
solana program show <PROGRAM_ID>

# View recent transactions
solana transaction-history <PROGRAM_ID>

# Monitor certificate issuance
# Use blockchain explorers:
# - Solana Explorer: https://explorer.solana.com
# - Solscan: https://solscan.io
```

## Troubleshooting

### "Program not deployed"
```bash
# Verify deployment
solana program show <PROGRAM_ID>
# Redeploy if needed
anchor deploy
```

### "Account not found"
- Ensure program is initialized
- Check PDA derivation matches program

### "Insufficient funds"
```bash
# Check balance
solana balance
# Airdrop (devnet only)
solana airdrop 2
```

## Support

For deployment issues:
- Discord: TYT Developers Channel
- Email: dev@takeyourtoken.app
- Docs: https://docs.takeyourtoken.app/solana
