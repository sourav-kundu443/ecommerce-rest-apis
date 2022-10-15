import express from "express";
import mongoose from "mongoose";
import { APP_PORT_NUM, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";

const app = express();

import routes from "./routes";

app.use(express.json());

// DB connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connecton error:"));
db.once("open", () => {
  console.log("DB connected");
});

app.use(`/api`, routes);

app.use(errorHandler);

app.listen(APP_PORT_NUM, () =>
  console.log(`Listening on port ${APP_PORT_NUM}`)
);
