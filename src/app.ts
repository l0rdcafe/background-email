import express, { Request, Response } from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { json } from "body-parser";
import { config } from "dotenv";
import routes from "./routes";

config();

const app = express();
app.use(morgan("short"));
app.use(cors());
app.use(json());
app.use(helmet());
app.use("/", routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

export default app;
