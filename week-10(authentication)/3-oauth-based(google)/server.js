import axios from "axios";
import "dotenv/config";
import express from "express";
const app = express();

app.use(express.json());

// fake databse
const users = [];

// endpoint that frontend hits and we will redirect to google auth
app.get("/google-login", (req, res) => {
  const GOOGLE_AUTH_ENDPOINT = process.env.GOOGLE_AUTH_ENDPOINT;
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID, // helps Google to identify which app is asking for Google login
    response_type: "code", // code for authorization code
    redirect_uri: process.env.REDIRECT_URI, // this is the url that google redirect after login
    scope: "openid profile email", // openid enables OIDC without this we will not get id_token
    access_type: "offline", // google will send refresh token as well
    prompt: "consent",
  });
  res.redirect(`${GOOGLE_AUTH_ENDPOINT}?${params}`);
});

// callback endpoint that Google calls after success google login
app.get("/auth/google/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error) {
    return res.status(403).json({
      error: error,
    });
  }
  try {
    // exchange Authorization code for access_token,refresh_token and id_token
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI, // here this is just used for security verification pupose
    });
    const { access_token, refresh_token, id_token } = tokenResponse.data;
    return res.json({
      refresh_token, // to refresh the access token
      access_token, // used for google apis
      id_token, // used for identity verification
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
