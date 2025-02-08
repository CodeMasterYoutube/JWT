const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 5000;
const JWT_SECRET = "A_COMPLEX_SECRET_KEY";

app.use(express.json());
app.use(cors());

const users = [];
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (users.find((user) => user.username === username)) {
      return res.status(400).json({ message: "Username already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
});

app.post("/api/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password!" });
    }
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader: ", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token : ", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
app.get("/api/protected", authMiddleware, (req, res) => {
  console.log("Req.user: ", req.user);
  return res
    .status(200)
    .json({ message: "This is a protected route/data", user: req.user });
});
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
