export interface ITokenCacheService {
  isTokenBlacklisted(jti: string): Promise<boolean>;
  addTokenToBlacklist(jti: string, ttl: number): Promise<void>;
}
