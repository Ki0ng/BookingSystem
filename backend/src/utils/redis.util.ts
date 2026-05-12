import { createClient, RedisClientType } from 'redis';
import { env } from '../config/env.config';
import logger from './logger';

export class RedisUtil {
  private client: RedisClientType;
  private isConnecting: boolean = false;

  constructor() {
    this.client = createClient({
      url: env.REDIS_URL || 'redis://127.0.0.1:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            logger.warn('⚠️ Redis: Connection failed. Operating without cache.');
            return false; // Stop retrying
          }
          return Math.min(retries * 500, 2000);
        }
      }
    });

    this.client.on('error', (err) => {
      // Suppress noisy error logs if we are not connected
      if (this.client.isOpen) {
        logger.error('❌ Redis Error: ' + err);
      }
    });
    this.client.on('connect', () => logger.info('🚀 Redis: Connecting to server...'));
    this.client.on('ready', () => logger.info('✅ Redis: Ready and Connected!'));
    this.client.on('end', () => logger.warn('⚠️ Redis: Connection closed'));
  }

  async connect() {
    if (this.isConnecting || this.client.isOpen) return;
    
    this.isConnecting = true;
    try {
      logger.info('🔍 Redis: Attempting to connect...');
      await this.client.connect();
    } catch (err) {
      // Quiet fail - app can work without Redis
    } finally {
      this.isConnecting = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client.isOpen) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  async setEx(key: string, seconds: number, value: any) {
    if (!this.client.isOpen) return;
    try {
      await this.client.setEx(key, seconds, JSON.stringify(value));
    } catch (err) {
      // Ignore set errors
    }
  }

  async del(key: string) {
    if (!this.client.isOpen) return;
    try {
      await this.client.del(key);
      logger.info(`🗑️ [REDIS DEL] Đã xóa Key: ${key}`);
    } catch (err) {
      // Ignore del errors
    }
  }
}

export const redisUtil = new RedisUtil();
