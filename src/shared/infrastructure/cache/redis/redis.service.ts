import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    const host = this.configService.get('REDIS_HOST', 'localhost');
    const port = this.configService.get('REDIS_PORT', 6379);
    const password = this.configService.get('REDIS_PASSWORD');
    const db = this.configService.get('REDIS_DB', 0);

    this.client = new Redis({
      host,
      port: parseInt(port.toString(), 10),
      password: password || undefined,
      db: parseInt(db.toString(), 10),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis client error:', err);
    });

    this.client.on('close', () => {
      this.logger.warn('Redis client connection closed');
    });
  }

  /**
   * Get Redis client for advanced operations
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Get a value from Redis
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in Redis
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds (optional)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Delete a value from Redis
   * @param key Cache key
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys from Redis
   * @param keys Array of cache keys
   */
  async delMany(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting multiple cache keys:`, error);
    }
  }

  /**
   * Delete keys matching a pattern
   * @param pattern Key pattern (e.g., 'user:*')
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting keys with pattern ${pattern}:`, error);
    }
  }

  /**
   * Clear all cache (FLUSHDB)
   */
  async reset(): Promise<void> {
    try {
      await this.client.flushdb();
      this.logger.warn('Cache RESET: All keys cleared');
    } catch (error) {
      this.logger.error('Error resetting cache:', error);
    }
  }

  /**
   * Check if a key exists in Redis
   * @param key Cache key
   * @returns true if key exists, false otherwise
   */
  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Error checking cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL of a key
   * @param key Cache key
   * @returns TTL in seconds, or -1 if no TTL, -2 if key doesn't exist
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      return -2;
    }
  }

  /**
   * Set expiration time for a key
   * @param key Cache key
   * @param seconds TTL in seconds
   */
  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Error setting expiration for key ${key}:`, error);
    }
  }

  /**
   * Get or set a value in cache (cache-aside pattern)
   * @param key Cache key
   * @param factory Function to generate value if not in cache
   * @param ttl Time to live in seconds (optional)
   * @returns Cached or generated value
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, generate value
      const value = await factory();

      // Store in cache for next time
      await this.set(key, value, ttl);

      return value;
    } catch (error) {
      this.logger.error(`Error in getOrSet for key ${key}:`, error);
      // If cache fails, still return the factory result
      return await factory();
    }
  }

  /**
   * Increment a value
   * @param key Cache key
   * @param delta Amount to increment by (default: 1)
   * @returns New value after increment
   */
  async incr(key: string, delta: number = 1): Promise<number> {
    try {
      return await this.client.incrby(key, delta);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Decrement a value
   * @param key Cache key
   * @param delta Amount to decrement by (default: 1)
   * @returns New value after decrement
   */
  async decr(key: string, delta: number = 1): Promise<number> {
    try {
      return await this.client.decrby(key, delta);
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Check if Redis is connected
   */
  isConnected(): boolean {
    return this.client.status === 'ready';
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy() {
    this.logger.log('Disconnecting Redis client...');
    await this.client.quit();
  }
}
