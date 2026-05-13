import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { AUTH_CONFIG } from '../config/constants';

export class AuthUtils {
  static async generateOTP(): Promise<{ code: string; hash: string; expires: Date }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await bcrypt.hash(code, 10);
    const expires = new Date(Date.now() + AUTH_CONFIG.OTP_EXPIRY_MS);
    return { code, hash, expires };
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async compareOTP(code: string, hash: string): Promise<boolean> {
    return bcrypt.compare(code, hash);
  }

  static generateTokens(userId: string, role: string, secret: string, refreshSecret: string) {
    const accessToken = jwt.sign({ userId, role }, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId, role }, refreshSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken, user: { userId, role } };
  }
}
