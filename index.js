const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = 3000;

const userRouter = require("./router/userRouter");

app.get("/", (req, res) => {
  res.json("hello world");
});

app.use(bodyParser.json());

app.use("/users", userRouter);


app.listen(port, (req, res) => {
  console.log("server has been started");
});
