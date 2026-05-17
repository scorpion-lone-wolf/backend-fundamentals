## OAuth 2.0 & OIDC (OpenID Connect)

### What problem does OAuth solve?

- Before OAuth, if an app wanted to access your Google data, you would have to give your Google password directly to the app.
- This created several problems:
  - Huge security risk
  - The app could misuse your password
  - It was difficult to revoke access

> OAuth solves this by allowing apps to access resources without sharing passwords.

---

### OAuth definition

- OAuth 2.0 is an authorization framework that allows Application A to access resources from Application B without sharing the user's password.

**Note:**

- OAuth is about authorization: "What is this app allowed to access?"
- It is not about authentication: "Who is the user?"

---

### **OAuth actors**

1. **Resource Owner**: the user
2. **Client**: the application requesting access (for example, your server)
3. **Authorization Server**: the server that handles login and token issuance
4. **Resource Server**: the API that holds the user's protected data

**Example:**

- Suppose Notion imports Google Drive files.
  - **Resource Owner** = You
  - **Client** = Notion
  - **Authorization Server** = Google login server
  - **Resource Server** = Google Drive API

---

### Important OAuth concepts

**Access token**

- Used to access protected APIs.

**Scope**

- Defines which permissions are allowed (for example, read email only or access contacts).

**Consent screen**

- Shows the user which app wants access and what permissions it requests.

---

### OAuth flow (high level)

1. User clicks "Login with Google".
2. The frontend redirects the user to Google.
3. Google authenticates the user on the login page.
4. Google shows the consent screen (for example: "This app wants access to your profile").
5. Google issues an authorization code and sends it back to your app.
6. The backend exchanges the code for tokens from Google.
   - In return, it receives an access token and often a refresh token.
7. The app uses the Google access token to call Google APIs, such as fetching profile or email data.

---

### Common OAuth flows used

1. **Authorization Code Flow**: for web apps and backend applications.
2. **Client Credentials Flow**: used for internal servers or machine-to-machine communication with no user involvement.
3. **Device Flow**: used for devices with limited input capability, such as smart TVs.
4. **PKCE (Proof Key for Code Exchange)**: adds security for public clients like mobile or single-page apps.

---

### **Key takeaway**

- OAuth does not tell an application who the user is.
- OAuth only communicates that the application has authorization to access resources.
- Authentication and identity information come from **OpenID Connect (OIDC)**, which is built on top of OAuth.
