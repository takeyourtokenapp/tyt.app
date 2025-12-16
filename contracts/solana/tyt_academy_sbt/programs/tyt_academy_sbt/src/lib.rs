use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("TYT11111111111111111111111111111111111111111");

#[program]
pub mod tyt_academy_sbt {
    use super::*;

    /// Issue a new certificate SBT to a user
    /// Only callable by the issuer authority
    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        course_id: u64,
        level: u8,
    ) -> Result<()> {
        require!(level >= 1 && level <= 3, AcademyError::InvalidLevel);

        let certificate = &mut ctx.accounts.certificate;
        let clock = Clock::get()?;

        certificate.owner = ctx.accounts.user.key();
        certificate.course_id = course_id;
        certificate.level = level;
        certificate.issued_at = clock.unix_timestamp;
        certificate.issuer = ctx.accounts.issuer.key();
        certificate.bump = ctx.bumps.certificate;
        certificate.is_revoked = false;

        emit!(CertificateIssued {
            user: ctx.accounts.user.key(),
            course_id,
            level,
            issued_at: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Verify if a user has a certificate for a course
    pub fn verify_certificate(
        ctx: Context<VerifyCertificate>,
        _course_id: u64,
    ) -> Result<bool> {
        let certificate = &ctx.accounts.certificate;
        Ok(!certificate.is_revoked)
    }

    /// Revoke a certificate (only issuer)
    pub fn revoke_certificate(
        ctx: Context<RevokeCertificate>,
        _course_id: u64,
    ) -> Result<()> {
        let certificate = &mut ctx.accounts.certificate;
        certificate.is_revoked = true;

        emit!(CertificateRevoked {
            user: certificate.owner,
            course_id: certificate.course_id,
        });

        Ok(())
    }

    /// Burn a certificate (only owner can burn their own)
    pub fn burn_certificate(
        ctx: Context<BurnCertificate>,
        _course_id: u64,
    ) -> Result<()> {
        emit!(CertificateBurned {
            user: ctx.accounts.certificate.owner,
            course_id: ctx.accounts.certificate.course_id,
        });

        Ok(())
    }

    /// Update issuer authority (only current authority)
    pub fn update_issuer_authority(
        ctx: Context<UpdateIssuerAuthority>,
        new_authority: Pubkey,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        let old_authority = config.issuer_authority;
        config.issuer_authority = new_authority;

        emit!(IssuerAuthorityUpdated {
            old_authority,
            new_authority,
        });

        Ok(())
    }

    /// Initialize program configuration
    pub fn initialize(ctx: Context<Initialize>, issuer_authority: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.issuer_authority = issuer_authority;
        config.bump = ctx.bumps.config;
        config.total_issued = 0;

        Ok(())
    }

    /// Get certificate details
    pub fn get_certificate_info(
        ctx: Context<GetCertificateInfo>,
        _course_id: u64,
    ) -> Result<CertificateInfo> {
        let certificate = &ctx.accounts.certificate;

        Ok(CertificateInfo {
            owner: certificate.owner,
            course_id: certificate.course_id,
            level: certificate.level,
            issued_at: certificate.issued_at,
            issuer: certificate.issuer,
            is_revoked: certificate.is_revoked,
        })
    }
}

#[derive(Accounts)]
#[instruction(course_id: u64, level: u8)]
pub struct IssueCertificate<'info> {
    #[account(
        init,
        payer = issuer,
        space = 8 + Certificate::INIT_SPACE,
        seeds = [b"certificate", user.key().as_ref(), course_id.to_le_bytes().as_ref()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        constraint = config.issuer_authority == issuer.key() @ AcademyError::Unauthorized
    )]
    pub config: Account<'info, ProgramConfig>,

    /// User receiving the certificate
    /// CHECK: Can be any account
    pub user: UncheckedAccount<'info>,

    #[account(mut)]
    pub issuer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(course_id: u64)]
pub struct VerifyCertificate<'info> {
    #[account(
        seeds = [b"certificate", user.key().as_ref(), course_id.to_le_bytes().as_ref()],
        bump = certificate.bump
    )]
    pub certificate: Account<'info, Certificate>,

    /// CHECK: Any account can verify
    pub user: UncheckedAccount<'info>,
}

#[derive(Accounts)]
#[instruction(course_id: u64)]
pub struct RevokeCertificate<'info> {
    #[account(
        mut,
        seeds = [b"certificate", certificate.owner.as_ref(), course_id.to_le_bytes().as_ref()],
        bump = certificate.bump
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(
        seeds = [b"config"],
        bump = config.bump,
        constraint = config.issuer_authority == issuer.key() @ AcademyError::Unauthorized
    )]
    pub config: Account<'info, ProgramConfig>,

    pub issuer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(course_id: u64)]
pub struct BurnCertificate<'info> {
    #[account(
        mut,
        seeds = [b"certificate", owner.key().as_ref(), course_id.to_le_bytes().as_ref()],
        bump = certificate.bump,
        constraint = certificate.owner == owner.key() @ AcademyError::Unauthorized,
        close = owner
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateIssuerAuthority<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        constraint = config.issuer_authority == current_authority.key() @ AcademyError::Unauthorized
    )]
    pub config: Account<'info, ProgramConfig>,

    pub current_authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + ProgramConfig::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, ProgramConfig>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(course_id: u64)]
pub struct GetCertificateInfo<'info> {
    #[account(
        seeds = [b"certificate", user.key().as_ref(), course_id.to_le_bytes().as_ref()],
        bump = certificate.bump
    )]
    pub certificate: Account<'info, Certificate>,

    /// CHECK: Any account
    pub user: UncheckedAccount<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Certificate {
    pub owner: Pubkey,           // 32
    pub course_id: u64,          // 8
    pub level: u8,               // 1 (1=Beginner, 2=Intermediate, 3=Advanced)
    pub issued_at: i64,          // 8
    pub issuer: Pubkey,          // 32
    pub bump: u8,                // 1
    pub is_revoked: bool,        // 1
}

#[account]
#[derive(InitSpace)]
pub struct ProgramConfig {
    pub issuer_authority: Pubkey, // 32
    pub bump: u8,                 // 1
    pub total_issued: u64,        // 8
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CertificateInfo {
    pub owner: Pubkey,
    pub course_id: u64,
    pub level: u8,
    pub issued_at: i64,
    pub issuer: Pubkey,
    pub is_revoked: bool,
}

#[event]
pub struct CertificateIssued {
    pub user: Pubkey,
    pub course_id: u64,
    pub level: u8,
    pub issued_at: i64,
}

#[event]
pub struct CertificateRevoked {
    pub user: Pubkey,
    pub course_id: u64,
}

#[event]
pub struct CertificateBurned {
    pub user: Pubkey,
    pub course_id: u64,
}

#[event]
pub struct IssuerAuthorityUpdated {
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
}

#[error_code]
pub enum AcademyError {
    #[msg("Unauthorized: Only issuer authority can perform this action")]
    Unauthorized,
    #[msg("Invalid level: Must be 1 (Beginner), 2 (Intermediate), or 3 (Advanced)")]
    InvalidLevel,
    #[msg("Certificate already exists for this course")]
    CertificateExists,
    #[msg("Certificate has been revoked")]
    CertificateRevoked,
}
