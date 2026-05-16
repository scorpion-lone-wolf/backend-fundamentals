# JWT-Based Authentication

This folder demonstrates a JWT-based authentication flow using `express`, `bcrypt`, and `jsonwebtoken`.

## Architecture flow

1. **Signup**
   - Client sends `POST /signup` with `email`, `name`, and `password`.
   - Server hashes the password and stores the user in an in-memory store.
   - Server returns success if the email does not already exist.

2. **Login**
   - Client sends `POST /login` with `email` and `password`.
   - Server verifies credentials.
   - On success, server issues:
     - **Access token**: short-lived JWT for authenticated requests.
     - **Refresh token**: long-lived JWT used to obtain new access tokens.
   - Server stores the refresh token in `refreshTokenInDB`.

3. **Protected route**
   - Client requests `GET /profile` with header `Authorization: Bearer <accessToken>`.
   - `authMiddleware` verifies the access token.
   - If valid, request continues and user data is returned.

4. **Refresh token**
   - Client sends `POST /refresh` with the current `refreshToken` in the body.
   - Server verifies the refresh token and checks it exists in `refreshTokenInDB`.
   - Server issues a new access token and a new refresh token.
   - Old refresh token is revoked and replaced with the new one.

5. **Logout**
   - Client sends `POST /logout` with the refresh token.
   - Server removes the refresh token from `refreshTokenInDB`.
   - The refresh token can no longer be used.

## Key components

- `server.js`
  - Handles signup, login, profile, refresh, and logout routes.
  - Uses `authMiddleware` to protect the `/profile` route.
- `auth.middleware.js`
  - Reads `Authorization` header.
  - Verifies the access token with `ACCESS_TOKEN_SECRET`.
  - Populates `req.user` if valid.
- `helper.js`
  - Exports secrets and token generation helpers.
  - `generateAccessToken()` signs payload with `ACCESS_TOKEN_SECRET`.
  - `generateRefreshToken()` signs payload with `REFRESH_TOKEN_SECRET`.

## Token strategy

- **Access token**
  - Short-lived (`15m`).
  - Sent in `Authorization` header for protected routes.
- **Refresh token**
  - Long-lived (`7d`).
  - Stored on the client and sent when requesting a new access token.
  - Stored server-side in `refreshTokenInDB` so it can be revoked.

## Security notes

- This demo uses an in-memory store for users and refresh tokens.
- In production, use a database or persistent store.
- Keep `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` secure.
- Use HTTPS and a secure client storage strategy for refresh tokens.

## Route summary

- `POST /signup` — register a new user
- `POST /login` — authenticate and receive tokens
- `GET /profile` — protected route using access token
- `POST /refresh` — renew access token using refresh token
- `POST /logout` — revoke refresh token
