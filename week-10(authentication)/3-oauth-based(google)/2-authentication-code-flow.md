## Authorization Code Flow

This flow is used by:

- Google Login
- GitHub Login
- Facebook Login
- Microsoft Login

---

### Full flow (high level)

1. User clicks "Login with Google".
   - The frontend redirects the user to the Google authorization endpoint.
2. Google shows the login page.
   - The user authenticates directly with Google.
3. Google shows the consent screen.
4. Google redirects back to your app.
   - Redirect URL: `https://yourapp.com/callback?code=abc123`
   - Important: Google sends an authorization code, not an access token.
5. Backend exchanges the code.
   - Your backend sends the authorization code, client secret, and redirect URI to the Google token endpoint.
6. Google returns tokens.
   - Backend receives:
     - access token
     - refresh token
     - ID token (OIDC)
7. Backend creates a local session/login.
   - Create the user if needed.
   - Store the user.
   - Create an app session or JWT.

Now the user is logged into your app.

---

### Main OAuth components

- **Client ID**: public identifier of your app.
- **Client secret**: private credential for your backend; must stay secure.
- **Redirect URI**: where Google sends the user after approval.
- **Authorization code**: temporary, short-lived code.
- **Access token**: used to call Google APIs.
- **Refresh token**: used to obtain new access tokens later.
- **ID token (OIDC)**: JWT containing identity information, used for authentication.

Example identity data in an ID token:

- email
- name
- Google user ID

---

### Real HTTP flow

1. Frontend redirects to:
   `GET https://accounts.google.com/o/oauth2/v2/auth`
   with params:
   - client_id
   - redirect_uri
   - scope
   - response_type=code
2. Google redirects back:
   `GET /callback?code=abc123`
3. Backend exchanges the code:
   `POST https://oauth2.googleapis.com/token`
   with:
   - code
   - client_secret
   - redirect_uri

Google returns:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "id_token": "..."
}
```

---

NOTE: OpenID Connect is just an Authentication Layer above OAUth.
