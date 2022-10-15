import dotenv from "dotenv";

dotenv.config();
export const { APP_PORT_NUM, DEBUG_MODE, DB_URL, JWT_SECRET } = process.env;
