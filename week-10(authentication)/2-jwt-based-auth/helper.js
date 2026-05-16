import jwt from "jsonwebtoken";
export const ACCESS_TOKEN_SECRET = "my-access-secret";
export const REFRESH_TOKEN_SECRET = "my-refresh-secret";
export function generateAccessToken(payload, options) {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
  return accessToken;
}

export function generateRefreshToken(payload, options) {
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
  return refreshToken;
}

export function readCookieData(cookieData) {}
