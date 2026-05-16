import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./auth.middleware.js";
import { generateAccessToken, generateRefreshToken, REFRESH_TOKEN_SECRET } from "./helper.js";

const PORT = 3000;

const app = express();

// Parse JSON request bodies and set req.body.
app.use(express.json());
// This will parse the cookie and provide us in req.cookies object
app.use(cookieParser());
// In-memory user store for demo only.
// A production app should use a persistent database.
const users = [];

// Store refresh tokens so they can be revoked.
// This is a simple demo store. Use a database or cache in real apps.
const refreshTokenInDB = {};

// Public routes
app.get("/", (req, res) => {
  return res.json({
    success: true,
    data: [],
    message: "home page",
  });
});

// Signup route: register a new user with a hashed password.
app.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Reject if the email already exists.
    const user = users.find(user => user.email === email);
    if (!user) {
      // Hash the password before saving.
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = {
        id: users.length + 1,
        email,
        name,
        password: hashedPass,
      };
      users.push(newUser);
      return res.json({
        message: "User created successfully",
      });
    }

    return res.status(409).json({
      error: "User already exists.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Login route: verify user credentials and issue JWT tokens.
app.post("/login", async (req, res) => {
  try {
    const { email, password: rawPassword } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Compare the provided password with the stored hashed password.
    const isMatched = await bcrypt.compare(rawPassword, user.password);
    if (!isMatched) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Generate short-lived access token.
    const accessToken = generateAccessToken(
      {
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: "15m",
      }
    );

    // Generate long-lived refresh token.
    const refreshToken = generateRefreshToken(
      {
        userId: user.id,
      },
      {
        expiresIn: "7d",
      }
    );

    // Persist refresh token so it can be revoked later.
    refreshTokenInDB[refreshToken] = {
      userId: user.id,
    };
    // save the refresh token in cookie
    // res.cookie("refreshToken", refreshToken, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    //   httpOnly: true,
    //   secure: false, // true in production
    // });
    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Protected profile route: authMiddleware validates the access token.
app.get("/profile", authMiddleware, (req, res) => {
  const user = req.user;
  return res.json({
    message: "Protected route",
    data: [user],
  });
});

// Refresh endpoint: exchange a valid refresh token for a new access token.
app.post("/refresh", (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token required",
      });
    }

    // check the database if refresh token is present in db or not (validate the refresh token)
    if (!refreshTokenInDB[refreshToken]) {
      return res.status(403).json({
        error: "Refresh token is invalid",
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Issue a new short-lived access token.
    const accessToken = generateAccessToken(
      {
        userId: decoded.userId,
      },
      {
        expiresIn: "15m",
      }
    );

    // Rotate the refresh token: revoke old and issue a new one.
    const newRefreshToken = generateRefreshToken(
      {
        userId: decoded.userId,
      },
      {
        expiresIn: "7d",
      }
    );
    delete refreshTokenInDB[refreshToken];
    refreshTokenInDB[newRefreshToken] = { userId: decoded.userId };
    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.log("err", error.message);
    return res.status(401).json({
      error: "Refresh token is invalid",
    });
  }
});

// Logout route: revoke the refresh token so it can no longer be used.
app.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      error: "Refresh token required to log out",
    });
  }

  // Remove the refresh token from storage.
  if (refreshTokenInDB[refreshToken]) {
    delete refreshTokenInDB[refreshToken];
    return res.json({
      message: "Logged out successfully",
    });
  }

  return res.status(404).json({
    error: "Refresh token not found or already invalidated",
  });
});

app.listen(PORT, () => {
  console.log("Server started at PORT:", PORT);
});
