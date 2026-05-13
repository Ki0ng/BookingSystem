import { createClient, RedisClientType } from 'redis';
import { env } from '../config/env.config';
import logger from './logger';

export class RedisUtil {
  private client: RedisClientType;
  private isConnecting: boolean = false;

  constructor() {
    try {
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

      this.client.on('error', (redisError) => {
        if (this.client?.isOpen) {
          logger.error('❌ Redis Error: ' + redisError);
        }
      });
      this.client.on('connect', () => logger.info('🚀 Redis: Connecting to server...'));
      this.client.on('ready', () => logger.info('✅ Redis: Ready and Connected!'));
      this.client.on('end', () => logger.warn('⚠️ Redis: Connection closed'));
    } catch (redisError) {
      logger.error('❌ Redis: Initialization failed. Please check your REDIS_URL. Server will run without Redis.');
      this.client = null as any;
    }
  }

  async connect() {
    if (this.isConnecting || this.client.isOpen) return;

    this.isConnecting = true;
    try {
      logger.info('🔍 Redis: Attempting to connect...');
      await this.client.connect();
    } catch (redisError) {
      // Quiet fail - app can work without Redis
    } finally {
      this.isConnecting = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client.isOpen) return null;
    try {
      const cachedValue = await this.client.get(key);
      return cachedValue ? JSON.parse(cachedValue) : null;
    } catch (redisError) {
      return null;
    }
  }

  async setEx(key: string, seconds: number, value: any) {
    if (!this.client.isOpen) return;
    try {
      await this.client.setEx(key, seconds, JSON.stringify(value));
    } catch (redisError) {
      // Ignore set errors
    }
  }

  async del(key: string) {
    if (!this.client.isOpen) return;
    try {
      await this.client.del(key);
      logger.info(`🗑️ [REDIS DEL] Đã xóa Key: ${key}`);
    } catch (redisError) {
      // Ignore del errors
    }
  }
}

export const redisUtil = new RedisUtil();
