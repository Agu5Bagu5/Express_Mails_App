const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtKey = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Anda belum Log In" });

  jwt.verify(req.cookies.token, jwtKey, (err, user) => {
    if (err) return res.status(500).json({ msg: err });

    req.user = user;
    next();
  });
};

module.exports = auth;
