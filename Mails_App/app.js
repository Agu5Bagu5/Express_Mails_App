const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routers/users_router.js");
const mailsRouter = require("./routers/mails_router.js");
require("dotenv").config();

const port = process.env.SERVER_PORT;
const app = express();
//middleware
app.use(express.json());
app.use(cookieParser());
//db
require("./connection/db.js");

app.use(usersRouter);
app.use(mailsRouter);
app.listen(
  port,
  console.log(`server up and running at http://localhost:${port}`)
);
