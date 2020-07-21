import dotenv from "dotenv";
dotenv.config();

export const dbUrl = process.env.DB_URL as string;
export const env = process.env.ENVIRONMENT as string;
export const jwtKeyAuth = process.env.JWT_KEY_AUTH_TOKEN as string;
export const jwtKeyRefreshToken = process.env.JWT_KEY_REFRESH_TOKEN as string;
export const redisUrl = process.env.REDIS_URL as string;
export const tokenExpiryTime = process.env.AUTH_TOKEN_EXPIRY_TIME as string;
export const port = process.env.PORT as string;
