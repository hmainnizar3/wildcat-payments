import express from "express";

import cors from "cors";

import passport from "passport";
import api from "./api";
import * as middlewares from "./middlewares";
import passportConfig from "./passport-config";
import { AppDataSource } from "./data-source";
export const app = express();

const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env

// passport stuff
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 3000;
if (!jwtSecret) {
  process.abort();
}
passportConfig(passport, jwtSecret);
app.use(passport.initialize());

// cors and basic middlewares
app.use(cors());
app.use(express.json());

app.use("/api/v1", api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export const server = app.listen(port, () => {
  console.log(`⚡️ Server running on port ⚡ ${port}`);
});

(async () => {
  // INIT THE DB
  await AppDataSource.initialize();
})();
