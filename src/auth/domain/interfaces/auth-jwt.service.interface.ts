export interface JwtPayload {
  id: number;
  email: string;
  roleId: number | null;
  jti: string;
  tokenVersion: number;
  exp: number;
}

export interface AuthJwtServiceInterface {
  generateAccessToken(
    userId: number,
    email: string,
    roleId: number | null,
    jti: string,
    tokenVersion: number,
  ): string;
  generateRefreshToken(
    userId: number,
    email: string,
    roleId: number | null,
    jti: string,
    tokenVersion: number,
  ): string;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}
