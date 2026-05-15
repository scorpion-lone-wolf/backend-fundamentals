# Session-Based Authentication Notes

This folder demonstrates a simple session-based authentication flow using `express`, `express-session`, `bcrypt`, and `better-sqlite3`

## Dependencies

- `express`: HTTP server framework for routes and middleware.
- `express-session`: session middleware that creates a session object, manages session storage, and sends the session cookie.
- `bcrypt`: securely hashes user passwords.
- `better-sqlite3`: lightweight SQLite database driver.

## How `express-session` works

1. `app.use(session(...))` installs the session middleware.
2. On each request, the middleware checks for a session cookie from the browser.
3. If a valid session ID exists, it loads the stored session data from the configured store and attaches it to `req.session`.
4. If the session is modified, express-session saves the data back to the store and refreshes the cookie.
5. The client receives a cookie named `connect.sid` by default.

## Cookie and session details

- `req.sessionID`: the unique session ID string.
- `req.session`: the session object where application data is stored.
- A session is stored on the server side, while the cookie holds only the session ID.

### Cookie settings used in this project

- `httpOnly: true`
  - prevents client-side JavaScript from reading the cookie.
- `maxAge: 60 * 60 * 1000`
  - session cookie expires after 1 hour.
- `secure: false`
  - should be `true` in production when HTTPS is enabled.
- `sameSite: "strict"`
  - helps protect against cross-site request forgery (CSRF).

## Why `express-session` is enough here

`express-session` already manages the session cookie for you:

- it generates a `sessionID`
- it sends the `Set-Cookie` header to the browser
- it reads the cookie on future requests
- it populates `req.session`

That means you do not need a separate `express-cookie` or manual cookie parsing for this session flow.

## Important notes

- The default session store is in-memory. This is fine for learning but not safe for production.
- In a real application, use a persistent store such as Redis, MongoDB, or a database-backed store.
- Keep the session secret secure and do not hardcode it in source code for production.

## Flow in this project

- `POST /signup`
  - creates a user with a hashed password.
- `POST /login`
  - verifies credentials and stores user data in `req.session`.
- `GET /profile`
  - checks `req.session.user` and returns profile data only when logged in.
- `POST /logout`
  - destroys the session and clears the session cookie.

## Key distinction

- `req.sessionID` is just the session identifier.
- `req.session` is the session object where you store data like `{ user: { id, email } }`.

## Express cookie context

If you need to set custom cookies manually, Express offers `res.cookie(...)`.
However, for session-based authentication, `express-session` is the recommended middleware because it handles the cookie lifecycle and session store integration automatically.
