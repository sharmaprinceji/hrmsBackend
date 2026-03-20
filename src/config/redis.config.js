// import { createClient } from "redis";
// import logger from "./logger.config.js";

// // const redisClient = createClient({
// //     url: process.env.REDIS_URL,
// // })

// // const redisClient = createClient({
// //     url: process.env.REDIS_URL,
// //     maxRetriesPerRequest:null,
// // });

// redisClient.on("connect", () => {
//     logger.info("Redis connected");
// });

// redisClient.on("error", (err) => {
//     logger.error("Redis error", err);
// });

// await redisClient.connect();

// export default redisClient;

import { Redis } from "@upstash/redis";
import logger from "./logger.config.js";

let redisClient = null;

if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });

    logger.info("Upstash Redis initialized");
  } catch (error) {
    logger.error("Redis init failed", error);
  }
} else {
  logger.warn("Redis not configured (missing env)");
}

export default redisClient;