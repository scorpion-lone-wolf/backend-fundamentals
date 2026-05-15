import bcrypt from "bcrypt";
import "dotenv/config";
import express from "express";
import session from "express-session";
import { db } from "./db.js";

const app = express();
app.use(express.json());

// express-session middleware creates and manages the session for each request.
// It also sends a session cookie (default name: connect.sid) to the client.
app.use(
  session({
    secret: process.env.SESSION_SECRET, // It is used to sign the sessionID
    resave: false, // Do not save session back to store if it was not modified.
    saveUninitialized: false, // Do not create session until something is stored.
    cookie: {
      httpOnly: true, // Prevent client-side JS from reading the cookie.
      maxAge: 60 * 60 * 1000, // 1 hour expiration for the session cookie.
      secure: false, // Set true in production when using HTTPS.
      sameSite: "strict", // Mitigate CSRF by restricting cross-site cookie sending.
    },
  })
);

// Signup route: create a new user with a hashed password.
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUser = db.prepare("INSERT INTO users (email,password) VALUES(?,?)");
    insertUser.run(email, hashedPassword);

    return res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    console.error("Signup error", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Login route: verify credentials and store minimal user data in the session.
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const prepareStmt = db.prepare("SELECT id, email, password FROM users WHERE email = ?");
    const user = prepareStmt.get(email);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        error: "Password not matched",
      });
    }

    // Store user data to req.session. express-session saves the session object in the configured store.
    req.session.user = {
      id: user.id,
      email: user.email,
    };

    return res.json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Protected profile route: uses session data to verify the user is logged in.
app.get("/profile", (req, res) => {
  const sessionID = req.sessionID; // The session id string saved to the cookie.
  const user = req.session.user; // The session object created during login.

  console.log("User Session ID:", sessionID);
  console.log("Session user:", user);

  if (user) {
    return res.json({
      status: true,
      data: {
        message: "Authenticated profile access",
        email: user.email,
      },
    });
  }

  return res.status(401).json({
    error: "You are not logged in",
  });
});

// Logout route: destroy the session and clear the cookie on the client.
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error", err);
      return res.status(500).json({
        error: "Logout failed",
      });
    }
    // Remove session cookie from browser.
    res.clearCookie("connect.sid");
    return res.json({
      message: "Logout successful",
    });
  });
});
// public route
app.get("/", (req, res) => {
  res.send({
    success: true,
  });
});
app.listen(process.env.PORT, () => {
  console.log("Server started at port", process.env.PORT);
});
