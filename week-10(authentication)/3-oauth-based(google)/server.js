import axios from "axios";
import "dotenv/config";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const app = express();

app.use(express.json());

// fake databse
const users = [];

const clientID = process.env.CLIENT_ID;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

const oAuth2Client = new OAuth2Client(clientID);
// endpoint that frontend hits and we will redirect to google auth
app.get("/google-login", (req, res) => {
  const GOOGLE_AUTH_ENDPOINT = process.env.GOOGLE_AUTH_ENDPOINT;
  const params = new URLSearchParams({
    client_id: clientID, // helps Google to identify which app is asking for Google login
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
      client_id: clientID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI, // here this is just used for security verification pupose
    });
    const {
      access_token: googleAccessToken,
      refresh_token: googleRefreshToken,
      id_token,
    } = tokenResponse.data;
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: id_token,
      audience: clientID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // check if the user exist. using sub
    let user = users.find(u => u.googleId === sub);
    // if not exist the create one
    if (!user) {
      user = {
        id: users.length + 1,
        googleId: sub,
        email,
        name,
        picture,
      };
      users.push(user);
    }

    // create a jwt access_token and refresh_token
    const appAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      jwtAccessSecret,
      {
        expiresIn: 5 * 60, // 5min
      }
    );
    return res.json({
      message: "Successfully login to our app",
      app_access_token: appAccessToken,
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
