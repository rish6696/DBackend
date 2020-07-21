import express, { Request, Response, urlencoded, NextFunction } from "express";
import { router } from "./routes/index";
import mongoose from "mongoose";
import { dbUrl, env, port } from "./config";
import { development } from "./constants";
import { APIError } from "./utilities/APIError";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    if (env === development) console.log("MongoDb connected successfully");
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new APIError(404, "Not found"));
});

app.use(errorHandler);

app.listen(port, (): void => {
  if (env === development) console.log("listening' on the port", port);
});
