import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "./helper.js";

// NOte: auth middleware onlydeal with access token
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Token missing",
    });
  }
  // authorization : Bearer mytoken
  try {
    const accessToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
}
