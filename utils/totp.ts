import { TOTP } from 'otpauth';

export interface TOTPConfig {
  secret: string;
  label?: string;
  issuer?: string;
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
  digits?: number;
  period?: number;
}

export class TOTPHelper {
  private totp: TOTP;
  private secret: string;

  constructor(config: TOTPConfig) {
    this.secret = config.secret;

    // Create TOTP instance
    this.totp = new TOTP({
      issuer: config.issuer || 'Google',
      label: config.label || 'Test Account',
      algorithm: config.algorithm || 'SHA1',
      digits: config.digits || 6,
      period: config.period || 30,
      secret: config.secret,
    });
  }

  /**
   * Generate current TOTP code
   */
  generateCode(): string {
    return this.totp.generate();
  }

  /**
   * Create TOTP helper from base32 secret
   */
  static fromBase32Secret(
    secret: string,
    config?: Partial<TOTPConfig>
  ): TOTPHelper {
    return new TOTPHelper({
      secret,
      ...config,
    });
  }
}
