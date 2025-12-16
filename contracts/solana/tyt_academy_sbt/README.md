# TYT Academy Soulbound Token (SBT) Program

Non-transferable certificate NFTs for TYT Crypto Academy course completion.

## Overview

This Solana Anchor program implements Soulbound Tokens (SBTs) for the TYT Academy education platform. Certificates are non-transferable proof-of-completion tokens that remain permanently bound to the user's wallet.

## Features

- **Non-Transferable**: Certificates cannot be transferred between wallets
- **Course Completion**: Issued upon successful course completion
- **Level System**: Beginner (1), Intermediate (2), Advanced (3)
- **Verification**: Anyone can verify certificate ownership
- **Revocation**: Issuer can revoke certificates if needed
- **Burn**: Users can burn their own certificates
- **Authority Management**: Issuer authority can be updated

## Account Structure

### Certificate
```rust
pub struct Certificate {
    pub owner: Pubkey,        // Certificate owner
    pub course_id: u64,       // Unique course identifier
    pub level: u8,            // 1=Beginner, 2=Intermediate, 3=Advanced
    pub issued_at: i64,       // Unix timestamp
    pub issuer: Pubkey,       // Issuing authority
    pub bump: u8,             // PDA bump seed
    pub is_revoked: bool,     // Revocation status
}
```

### ProgramConfig
```rust
pub struct ProgramConfig {
    pub issuer_authority: Pubkey,  // Authority that can issue certificates
    pub bump: u8,                  // PDA bump seed
    pub total_issued: u64,         // Total certificates issued (future use)
}
```

## Instructions

### 1. Initialize
Initialize the program configuration with issuer authority.

```typescript
await program.methods
  .initialize(issuerAuthority)
  .accounts({
    config: configPDA,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### 2. Issue Certificate
Issue a new certificate to a user (issuer only).

```typescript
await program.methods
  .issueCertificate(courseId, level)
  .accounts({
    certificate: certificatePDA,
    config: configPDA,
    user: userPublicKey,
    issuer: issuerWallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([issuerWallet])
  .rpc();
```

### 3. Verify Certificate
Verify if a user has a valid certificate.

```typescript
const isValid = await program.methods
  .verifyCertificate(courseId)
  .accounts({
    certificate: certificatePDA,
    user: userPublicKey,
  })
  .view();
```

### 4. Revoke Certificate
Revoke a certificate (issuer only).

```typescript
await program.methods
  .revokeCertificate(courseId)
  .accounts({
    certificate: certificatePDA,
    config: configPDA,
    issuer: issuerWallet.publicKey,
  })
  .signers([issuerWallet])
  .rpc();
```

### 5. Burn Certificate
Burn own certificate (user only).

```typescript
await program.methods
  .burnCertificate(courseId)
  .accounts({
    certificate: certificatePDA,
    owner: userWallet.publicKey,
  })
  .signers([userWallet])
  .rpc();
```

## PDA Derivation

### Certificate PDA
```typescript
const [certificatePDA, bump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("certificate"),
    userPublicKey.toBuffer(),
    new BN(courseId).toArrayLike(Buffer, "le", 8),
  ],
  program.programId
);
```

### Config PDA
```typescript
const [configPDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("config")],
  program.programId
);
```

## Events

### CertificateIssued
```rust
pub struct CertificateIssued {
    pub user: Pubkey,
    pub course_id: u64,
    pub level: u8,
    pub issued_at: i64,
}
```

### CertificateRevoked
```rust
pub struct CertificateRevoked {
    pub user: Pubkey,
    pub course_id: u64,
}
```

### CertificateBurned
```rust
pub struct CertificateBurned {
    pub user: Pubkey,
    pub course_id: u64,
}
```

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 6000 | Unauthorized | Only issuer authority can perform this action |
| 6001 | InvalidLevel | Level must be 1, 2, or 3 |
| 6002 | CertificateExists | Certificate already exists for this course |
| 6003 | CertificateRevoked | Certificate has been revoked |

## Security Features

1. **Authority Control**: Only designated issuer can mint certificates
2. **Non-Transferable**: No transfer instruction exists
3. **PDA-Based**: Deterministic addresses prevent certificate spoofing
4. **Revocation**: Bad actors can have certificates revoked
5. **Owner Burn**: Users can burn their own certificates if desired

## Integration with TYT Platform

The SBT program integrates with:
- **TYT Academy**: Course completion triggers certificate minting
- **Supabase Backend**: Off-chain metadata and verification
- **Frontend**: Display certificates in user profiles
- **VIP System**: Certificates can contribute to VIP rank

## Course ID Mapping

Course IDs are unique identifiers managed by the TYT Academy backend:

```typescript
const COURSE_IDS = {
  BITCOIN_BASICS: 1,
  ETHEREUM_INTRO: 2,
  DEFI_FUNDAMENTALS: 3,
  NFT_MASTERCLASS: 4,
  SECURITY_BEST_PRACTICES: 5,
  ADVANCED_TRADING: 6,
  // ... etc
};
```

## Level System

- **Level 1 (Beginner)**: Entry-level courses, basic concepts
- **Level 2 (Intermediate)**: Practical applications, trading strategies
- **Level 3 (Advanced)**: Expert topics, security, development

## Deployment

### Devnet
```bash
anchor build
anchor deploy --provider.cluster devnet
```

### Mainnet
```bash
anchor build --verifiable
anchor deploy --provider.cluster mainnet
```

## Testing

```bash
anchor test
```

## License

MIT

## Support

For issues or questions:
- GitHub: [TakeYourToken/contracts](https://github.com/takeyourtoken)
- Discord: TYT Community
- Email: dev@takeyourtoken.app
