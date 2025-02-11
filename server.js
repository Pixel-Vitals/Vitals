const express = require("express");
const admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Initialize Firebase Admin
const serviceAccount = require("./config/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static("public"));

async function isAuthenticated(req, res, next) {
  if (!req.session.user) return res.redirect("/");
  next();
}

app.get("/", (req, res) => {
  res.render("index");
});

// Render Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/doctorlogin", (req, res) => {
  res.render("doctorlogin");
});


app.get("/company", (req, res) => {
  res.render("companylogin");
});

app.get("/dashboard-doctor", (req, res) => {
  res.render("dashboard-doctor");
});

app.get("/dashboard-insurance", (req, res) => {
  res.render("dashboard-insurance");
});

app.post("/company", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

app.post("/doctorlogin", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});



app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

app.get("/show", isAuthenticated, (req, res) => {
  res.render("show", { user: req.session.user });
});
// Authentication Middleware


app.post("/login", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});


app.post("/signup", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: "Signup failed" });
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));


