// this middleware will get the JWKS from auth module enpoint and then verify the token
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// create jwks client
const jwksClientInstance = jwksClient({
  jwksUri: "http://localhost:4001/.well-known/jwks.json",
  cache: true,
  cacheMaxAge: 10 * 60 * 1000, // make sure that it will not call the auth-service every to to get public JWKS.json
  rateLimit: true,
});

async function getKeys(header, callback) {
  // here the header is pass py the jwt itself.
  // this is not req header but header that we set when signining jwt
  const key = await jwksClientInstance.getSigningKey(header.keyid);
  const verfyingPublicKey = key.getPublicKey();
  callback(null, verfyingPublicKey);
}

/**
//  * This function will verify the token from public key provided by auth service (JWKS) and after success verfying add user to request object
 */
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }
    // Extract jwt token
    const accessToken = authHeader.split(" ")[1];
    // verify token
    jwt.verify(
      accessToken,
      getKeys, // this function will return verfyingPublicKey
      {
        algorithms: ["RS256"],
        issuer: "auth-service",
      },
      (error, decoded) => {
        if (error) {
          return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message,
          });
        }
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
