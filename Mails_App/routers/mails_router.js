const express = require("express");
const auth = require("../middlewares/auth.js");
const { mailLoad, sendMail } = require("../controllers/mails.js");

const router = express.Router();

router.get("/Mails", auth, mailLoad);
router.post("/Mail/Send/:id", auth, sendMail);

module.exports = router;
