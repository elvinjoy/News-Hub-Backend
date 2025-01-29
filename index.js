const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./router/userRouter");
const blogRouter = require("./router/blogRouter");
const commentRouter = require("./router/commentRouter");
const cors = require("cors");
require("dotenv").config(); 

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Cluster"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});
