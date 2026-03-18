import logger from "../config/logger.config.js";

export default function errorMiddleware(err, req, res, next) {

  logger.error(err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}