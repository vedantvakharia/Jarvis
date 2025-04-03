const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));

let users = JSON.parse(fs.readFileSync("users.json")).users;

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));
