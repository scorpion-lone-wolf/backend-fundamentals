# Distributed JWT Authentication Notes

## Project structure

- `gateway/`
  - Public-facing entrypoint at `http://localhost:4000`.
  - Accepts client `/login` and `/orders` requests.
  - Proxies login and authorized order requests to internal services.
- `services/auth-service/`
  - Internal auth service on `http://localhost:4001`.
  - Issues JWT access tokens and exposes JWKS.
- `services/order-service/`
  - Internal order service on `http://localhost:4002`.
  - Verifies JWTs and returns protected order data.

## High-level flow

```mermaid
flowchart LR
  Client -->|POST /login| Gateway[Gateway (4000)]
  Gateway -->|POST /login| AuthService[Auth Service (4001)]
  AuthService -->|returns JWT| Gateway
  Gateway -->|returns JWT| Client

  Client -->|GET /orders (Bearer token)| Gateway
  Gateway -->|GET /orders| OrderService[Order Service (4002)]
  OrderService -->|fetch JWKS| AuthService
  AuthService -->|returns JWKS| OrderService
  OrderService -->|verify token| OrderService
  OrderService -->|returns orders| Gateway
  Gateway -->|returns orders| Client
```

## Detailed request flow

1. Client sends login credentials to `gateway` at `POST http://localhost:4000/login`.
2. `gateway` forwards the login request to `auth-service`.
3. `auth-service` checks hard-coded credentials.
4. If credentials are valid, `auth-service` signs a JWT with:
   - private key from `services/auth-service/keys/private.key`
   - algorithm `RS256`
   - issuer `auth-service`
   - key id `key-1`
5. `auth-service` returns the `accessToken` to `gateway`.
6. `gateway` forwards the `accessToken` back to the client.
7. Client calls `gateway` at `GET http://localhost:4000/orders` with `Authorization: Bearer <token>`.
8. `gateway` forwards the request headers to `order-service`.
9. `order-service` middleware extracts the token and uses `jwks-rsa` to fetch `http://localhost:4001/.well-known/jwks.json`.
10. `jwks-rsa` finds the public key using `kid: key-1`.
11. `order-service` verifies the token signature and claims with `jsonwebtoken`.
12. If verification succeeds, `order-service` returns the order response to `gateway`.
13. `gateway` returns the protected order response to the client.

## Libraries used and why

### gateway

- `express`
  - Lightweight HTTP server to expose public endpoints.
  - Handles request forwarding to internal services.
- `fetch` (native runtime fetch)
  - Proxy upstream service calls.
  - Reuses incoming request headers for authorized requests.

### auth-service

- `express`
  - Handles `/login` and `/.well-known/jwks.json`.
- `jsonwebtoken`
  - Signs JWTs with an RSA private key.
- `jose`
  - Converts the public PEM key into JWKS format.
  - Enables a standard JWKS public endpoint.

### order-service

- `express`
  - Handles protected `/orders` requests.
- `jsonwebtoken`
  - Verifies JWT tokens using a public key callback.
- `jwks-rsa`
  - Fetches and caches JSON Web Key Sets.
  - Dynamically resolves signing keys for RS256 tokens.

## Why this architecture?

- The `gateway` is the only public entrypoint, so internal services remain hidden.
- The `gateway` delegates authentication and protected resource access to specialized services.
- `auth-service` issues signed JWTs and exposes public keys via JWKS.
- `order-service` verifies tokens without needing direct public exposure.
- This pattern separates concerns and improves service isolation.

## Important implementation details

- `gateway` listens on port `4000` and proxies `/login` and `/orders`.
- `auth-service` listens on port `4001` and signs JWTs with `RS256`.
- `auth-service` exposes the JWKS endpoint at `/.well-known/jwks.json`.
- `order-service` listens on port `4002` and verifies JWTs using `jwks-rsa`.
- The `verifyToken` middleware enforces:
  - Bearer token presence
  - token issuer `auth-service`
  - algorithm `RS256`

## Notes & review points

- The public client-facing API now lives only in `gateway/`.
- `auth-service` and `order-service` should be treated as internal services.
- `gateway` forwards the client's authorization header to `order-service`.
- There is a small error handling issue in `services/order-service/middleware/authMiddleware.js`:
  - the callback parameter is `error`, but the JSON response uses `err.message`.
  - Correcting this prevents a runtime reference error.

## Run order

- Start `auth-service` on port `4001`.
- Start `order-service` on port `4002`.
- Start `gateway` on port `4000`.
- Use the gateway endpoints:
  - `POST http://localhost:4000/login`
  - `GET http://localhost:4000/orders`

## Summary

The project now demonstrates a public gateway pattern with:

- `gateway` exposing public endpoints and proxying requests,
- `auth-service` issuing RS256 JWTs and publishing JWKS,
- `order-service` verifying JWTs internally,
- clear separation between public and private service layers.
