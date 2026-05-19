import dotenv from "dotenv";
import express from "express";
import { google } from "googleapis";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const app = express();

// Basic validation: ensure OAuth credentials are provided
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn("Warning: CLIENT_ID or CLIENT_SECRET is missing. Set them in your .env file.");
}

// Create OAuth2 client used to build auth URLs and exchange authorization codes.
// Redirect URI must match the one registered in Google Cloud Console.
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000/auth/redirect"
);

// Scopes define the permissions the app will request from the user.
// For read-only listing we use calendar.readonly. To create events add
// https://www.googleapis.com/auth/calendar.events or https://www.googleapis.com/auth/calendar
const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * GET /connect-google-calender
 * Redirects the user to Google's OAuth 2.0 consent screen.
 * Note: route name has a small typo (calender) — keep it for compatibility.
 */
app.get("/connect-google-calender", (req, res) => {
  // Generate the URL that asks permissions for the required scopes
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // requests a refresh token
    scope: scopes,
    prompt: "consent", // force showing consent to receive refresh token
  });
  return res.redirect(url);
});

/**
 * GET /auth/redirect
 * OAuth2 callback: Google will redirect here with ?code=AUTH_CODE
 * Exchange the authorization code for access + refresh tokens.
 */
app.get("/auth/redirect", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    // Save tokens to the oauth2 client instance for immediate use
    oauth2Client.setCredentials(tokens);

    // NOTE: In a real app, persist tokens (especially refresh_token) securely
    // (database, encrypted storage) and associate them with the authenticated user.

    return res.json({ message: "Connected successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /get-cal-events
 * Returns upcoming events from the user's primary calendar.
 * Requires that `oauth2Client` has valid credentials (set after token exchange).
 */
app.get("/get-cal-events", async (req, res) => {
  try {
    // If credentials are not set, the client will not be authenticated.
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(), // filter out past events
      singleEvents: true, // expand recurring events into instances
      orderBy: "startTime", // order from soonest to latest
      maxResults: 10,
    });

    // Respond with the items array to make the response easier to consume on frontend
    return res.json({ events: response.data.items || [] });
  } catch (error) {
    // Return a clear error response and log the error for debugging
    console.error("Error fetching calendar events:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch events" });
  }
});

app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
