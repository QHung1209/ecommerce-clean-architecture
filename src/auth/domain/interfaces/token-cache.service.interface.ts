export interface TokenCacheServiceInterface {
  isTokenBlacklisted(jti: string): Promise<boolean>;
  addTokenToBlacklist(jti: string, ttl: number): Promise<void>;
}
