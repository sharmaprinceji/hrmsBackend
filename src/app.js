import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db.config.js";
import "./config/redis.config.js";

import router from "./routes/index.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api", router);

app.use(errorMiddleware);

export default app;