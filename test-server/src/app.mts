import express from "express";
import dotenv from "dotenv";
import errorhandler from "errorhandler";
import cors from "cors";
import nocache from "nocache";

// Load environment variables from .env file, where API keys and passwords are configured for the development environment
dotenv.config({ path: ".env" });

import * as indexRoute from "./routes/index.mjs";
import * as findGeeksRoute from "./routes/findgeeks.mjs";
import * as auth from "./routes/auth.mjs";
import {faqcount} from "./routes/faqcount.mjs";

// Create Express server
const app = express();
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/findgeeks/:fragment", findGeeksRoute.findgeeks);
app.get("/login", nocache(), auth.login);
app.get("/", indexRoute.index);
app.post("/faqcount", nocache(), faqcount);

if (process.env.NODE_ENV === "development") {
    // only use in development
    console.log("This is a development environment");
    app.use(errorhandler());
}

export default app;
