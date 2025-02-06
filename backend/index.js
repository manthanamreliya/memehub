import express from "express";

import "dotenv/config";
import memesRouter from "./routes/memesRouter.js";

import { initiateDBConnect } from "./common/mongoConnection.js";
import { logger } from "./middlewares/logger.js";

const app = express();

// Connect to the database
initiateDBConnect();

// app configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

// Routes

app.use("/memes", memesRouter);

app.listen(3030, () => {
	console.info("Express.js server is running on port 3030");
});