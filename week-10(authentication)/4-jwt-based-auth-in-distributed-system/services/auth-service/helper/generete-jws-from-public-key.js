import { exportJWK, importSPKI } from "jose";
import fs from "node:fs";
import path from "node:path";

const __dirname = import.meta.dirname;

// import the public key
const publicKeyPEM = fs.readFileSync(path.join(__dirname, "../keys/public.key"), {
  encoding: "utf-8",
});

const publicKey = await importSPKI(publicKeyPEM, "RS256");

// write the jwks to jwks.json
const jwks = await exportJWK(publicKey);
//a ddition metadata
jwks.alg = "RS256";
jwks.kid = "key-1"; // identify that this is key-1 and later to verify signature this key can be used

export { jwks };
