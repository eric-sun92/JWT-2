const express = require("express");
const app = express();

require("dotenv").config();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");

const posts = [
  {
    name: "Eric",
    title: "Post 1",
  },
  {
    name: "Kyle",
    title: "Post 2",
  },
];

const authorize = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  next();
};

app.get("/posts", authorize, (req, res) => {
  res.json(
    posts.filter((post) => {
      return post.name === req.user.name;
    })
  );
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.json({ accessToken: accessToken });
});

app.listen(3000, console.log("server running"));
