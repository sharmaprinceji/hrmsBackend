import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db.config.js";
import "./config/redis.config.js";

import router from "./routes/index.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
// import { serverAdapter } from "./config/bullBoard.js";


const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));


app.use("/api", router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use("/admin/queues", serverAdapter.getRouter());

app.use(errorMiddleware);

export default app;