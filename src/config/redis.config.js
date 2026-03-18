import { createClient } from "redis";
import logger from "./logger.config.js";

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("connect", () => {
    logger.info("Redis connected");
});

redisClient.on("error", (err) => {
    logger.error("Redis error", err);
});

await redisClient.connect();

export default redisClient;