export interface IResetPasswordTokenCacheService {
    getResetPasswordToken(email: string): Promise<string | null>;
    setResetPasswordToken(email: string, token: string): Promise<void>;
}
