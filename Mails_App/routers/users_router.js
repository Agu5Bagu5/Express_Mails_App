const express = require("express");
const {
  register,
  logIn,
  updateUsername,
  updatePw,
  logOut,
} = require("../controllers/users.js");
const checkDuplicate = require("../middlewares/user_validate.js");
const auth = require("../middlewares/auth.js");

const router = express.Router();

router.post("/Register", checkDuplicate, register);
router.post("/Log_In", logIn);
router.put("/Update/Username", auth, updateUsername);
router.put("/Update/PW", auth, updatePw);
router.delete("/Log_Out", logOut);

module.exports = router;
