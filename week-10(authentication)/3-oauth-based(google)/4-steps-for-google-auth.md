1. Go to Google Cloud Console and create a new project.
   - Set up the OAuth consent screen if required.

2. In the console, create OAuth credentials.
   - Choose "OAuth client ID" and select "Web application".
   - Add the redirect URI exactly as used by the app: `http://localhost:3000/auth/google/callback`.
   - Copy the generated `client_id` and `client_secret`.

3. Add required environment variables to your `.env` file.
   - `CLIENT_ID` = your Google OAuth client ID
   - `CLIENT_SECRET` = your Google OAuth client secret
   - `REDIRECT_URI` = `http://localhost:3000/auth/google/callback`
   - `GOOGLE_AUTH_ENDPOINT` = `https://accounts.google.com/o/oauth2/v2/auth`
   - `JWT_ACCESS_SECRET` = any strong secret for signing access JWTs
   - `JWT_REFRESH_SECRET` = any strong secret for refresh JWTs (not currently used in this example)

4. Start the Express server on port `3000`.
   - The app uses `express.json()` and the Google auth client from `google-auth-library`.

5. When the frontend visits `/google-login`, the server builds the Google login URL.
   - `client_id` tells Google which app is requesting login.
   - `response_type=code` requests an authorization code.
   - `redirect_uri` tells Google where to send the user back after login.
   - `scope="openid profile email"` requests identity information and ensures Google returns an `id_token`.
   - `access_type=offline` asks Google to return a `refresh_token`.
   - `prompt=consent` forces the consent screen so a refresh token can be issued.

6. Google redirects the user to `/auth/google/callback` with a `code` query parameter.
   - If Google returns an `error`, the server returns a 403 response.

7. The server exchanges the authorization code for tokens.
   - It sends a POST request to `https://oauth2.googleapis.com/token` with:
     - `client_id`
     - `client_secret`
     - `code`
     - `grant_type=authorization_code`
     - `redirect_uri`
   - Google responds with `access_token`, `refresh_token`, and `id_token`.

8. Verify the `id_token` using `google-auth-library`.
   - The app calls `oAuth2Client.verifyIdToken({ idToken: id_token, audience: CLIENT_ID })`.
   - This ensures the token is valid and issued for your app.

9. Extract user information from the token payload.
   - Use `sub` as the Google user ID.
   - Get `email`, `name`, and `picture` from the payload.

10. Find or create the user in the local database.

- The example uses an in-memory `users` array.
- If a user with the same `googleId` does not exist, create one.

11. Create an application JWT access token for your app.

- Sign a token with `jwtAccessSecret`.
- Include `userId` and `email` in the payload.
- Set `expiresIn: 5 * 60` for a 5-minute expiration.

12. Return the app access token in the response.

- The response includes:
  - `message: "Successfully login to our app"`
  - `app_access_token`

13. Important notes:

- `id_token` is used for identity verification through OpenID Connect.
- `access_token` is Google's API access token.
- `refresh_token` is returned only when `access_type=offline` and can be stored to request new Google tokens later.
- Use the official `google-auth-library` for secure token verification.
