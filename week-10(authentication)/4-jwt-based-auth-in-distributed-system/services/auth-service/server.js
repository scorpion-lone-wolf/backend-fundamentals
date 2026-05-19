import express from "express";
import jwt from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { jwks } from "./helper/generete-jws-from-public-key.js";
const app = express();
const PORT = 4001;
const __dirname = import.meta.dirname;

app.use(express.json());

// loading keys( private)
const privateKey = fs.readFileSync(path.join(__dirname, "./keys/private.key"), {
  encoding: "utf-8",
});

// login enpoint assumimg user already exist (signup completed)
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email !== "admin@example.com" || password !== "admin123") {
    return res.status(401).json({ message: "credientals mismatch" });
  }
  // genereate the token with private key
  const payload = {
    sub: "user_1",
    email: "admin@example.com",
    role: "admin",
  };
  const headers = {
    algorithm: "RS256",
    expiresIn: "15m",
    issuer: "auth-service",
    keyid: "key-1", // used to identify later which key was used to sign in so key-1 public key can be used to verify
  };
  const accessToken = jwt.sign(payload, privateKey, headers);
  return res.json({
    accessToken,
  });
});

// endpoint for service public key in jwks format
app.get("/.well-known/jwks.json", (req, res) => {
  return res.json({
    keys: [jwks],
  });
});

// starting auth service
app.listen(PORT, () => {
  console.log("Auth Server started at PORT :", PORT);
});
