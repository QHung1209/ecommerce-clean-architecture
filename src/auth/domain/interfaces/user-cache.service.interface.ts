export interface UserCacheServiceInterface {
  getTokenVersionByUserId(userId: number): Promise<number | null>;
  deleteTokenVersionByUserId(userId: number): Promise<void>;
}
