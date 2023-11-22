import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import tweetsRoter from "./router/tweets.js";
import authRoter from "./router/auth.js";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));

app.use("/tweets", tweetsRoter);
app.use("/auth", authRoter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

// sync 모델에서 정의한 스키마가 존재하지 않는다면 테이블을 새로 생성.
sequelize.sync().then(() => {
  console.log(`Server is started.... ${new Date()}`);
  const server = app.listen(config.port);
  initSocket(server);
});
