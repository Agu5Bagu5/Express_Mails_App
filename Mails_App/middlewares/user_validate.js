const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.js");

const checkDuplicate = [
  body("email", "Email tidak valid")
    .isEmail()
    .custom(async (v) => {
      const duplicate = await userModel.findOne({ email: v });
      if (duplicate) throw new Error("Email sudah digunakan");
      return true;
    }),
  body("username").custom(async (v) => {
    const duplicate = await userModel.findOne({ username: v });
    if (duplicate) throw new Error("Username sudah digunakan");
    return true;
  }),
  (req, res, next) => {
    const err = validationResult(req).array();
    if (err.length) return res.status(400).json({ msg: err[0].msg });
    next();
  },
];

module.exports = checkDuplicate;
