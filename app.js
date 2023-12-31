const express = require("express");

const jobsRouter = require("./routes/jobsRouter");
const authRouter = require("./routes/authRouter");
const errorHandler = require("./middlewares/errorandler");
const authMiddleware = require("./middlewares/authMiddleware");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const connectDB = require("./db/connect");

const app = express();

require("express-async-errors");

require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 50,
  })
);
app.use(express.json());

app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/jobs", authMiddleware, jobsRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("server is listening on port:", PORT);
    });
  } catch (error) {
    console.log("error connecting to db", error);
  }
};

start();
