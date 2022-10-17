import express from "express";
import mongoose from "mongoose";
import path from "path";
import { APP_PORT_NUM, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

global.appRoot = path.resolve(__dirname);

// for use of file
app.use(express.urlencoded({ extended: false }));

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
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

app.listen(APP_PORT_NUM, () =>
  console.log(`Listening on port ${APP_PORT_NUM}`)
);
