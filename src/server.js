import app from "./app.js";
import dotenv from "dotenv";
import logger from "./config/logger.config.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});