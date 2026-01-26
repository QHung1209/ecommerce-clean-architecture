export interface IUserCacheService {
  getTokenVersionByUserId(userId: number): Promise<number | null>;
  deleteTokenVersionByUserId(userId: number): Promise<void>;
}
