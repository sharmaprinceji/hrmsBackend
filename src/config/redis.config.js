import { createClient } from "redis";
import logger from "./logger.config.js";

const redisClient = createClient({
    url: process.env.REDIS_URL,
})

// const redisClient = createClient({
//     url: process.env.REDIS_URL,
//     maxRetriesPerRequest:null,
// });

// const redisClient = createClient({
//     socket: {
//         host: process.env.REDIS_HOST || "redis",  // docker service name
//         port: process.env.REDIS_PORT || 6379
//     }
// });

redisClient.on("connect", () => {
    logger.info("Redis connected");
});

redisClient.on("error", (err) => {
    logger.error("Redis error", err);
});

await redisClient.connect();

export default redisClient;