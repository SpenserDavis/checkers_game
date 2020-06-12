import express from "express";
import http from "http";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Router } from "./router";
import mongoose from "mongoose";
import cors from "cors";
import "./controllers/checkersController";

const app = express();

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/checkers");

const connection = mongoose.connection;
connection.on("connected", function () {
  console.log("connected to db");
});

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));
app.use("/api", Router.getInstance());

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on: ", port);
