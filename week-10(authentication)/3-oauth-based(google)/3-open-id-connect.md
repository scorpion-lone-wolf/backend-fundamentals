## OpenID Connect (OIDC)

- OAuth is not authentication.
- OpenID Connect is the identity layer built on top of OAuth.
- OIDC provides the `id_token` from the authorization server.

---

### Why OIDC is needed

- OAuth returns an access token that answers: "What can this app access?"
- OAuth does not answer: "Who is the user?"
- OIDC solves this by providing identity information about the user.

---

### What is `id_token`?

- A JWT token
- Contains identity information
- Signed by the identity provider (for example, Google)

Example payload:

```json
{
  "sub": "123456789",
  "email": "john@gmail.com",
  "name": "John",
  "picture": "...",
  "iss": "https://accounts.google.com"
}
```

**Remember:** Access token != ID token.

In exchange for the authorization code, Google returns:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "id_token": "..."
}
```

---

### What your backend usually does

1. Verify the `id_token`
   - signature
   - expiration
   - issuer
   - audience (`aud` should match your client ID)
2. Extract identity information:

```json
{
  "sub": "123456789", // this is the unique Google user ID.
  "email": "john@gmail.com",
  "name": "john",
  "picture": "...",
  "iss": "https://accounts.google.com", // who issue this token (based on this we can identify whether the user login with google or other OAuth)
  "aud": "your-client-id", // used to verify if the token is genuine or not as it is secret key between us and google
  "exp": 123456789 // time at which the token will expire
}
```

- `sub` is the unique user ID from the identity provider.

3. Find or create the local user.
4. Create your app session or JWT.
5. Return Our token to user so that he can log in to our system

---
