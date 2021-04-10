import sirv from "sirv";
import compression from "compression";
import * as sapper from "@sapper/server";
import express from "express";
import HttpServer from "http";
import { Server } from "socket.io";
import type { Parameter } from "./models/parameter";
import { flatSyntax } from "./logic/syntax_tree";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();
app.use(
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware()
);



const httpServer = new HttpServer.Server(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const defaultParameters: Array<Parameter> = [
  {
    name: "Price",
    required: true,
    type: flatSyntax[1],
  },
];
const defaultModelName = "MyModelName";
let parameters = defaultParameters;
let modelName = defaultModelName;
io.on("connection", (socket) => {
  console.log("CONNECTION");
  socket.emit("parameters", parameters);
  socket.emit("modelName", modelName);

  socket.on("parameters", (value) => {
    parameters = value;
    console.log("NEW PARAMETERS", Date.now(), parameters);
    socket.broadcast.emit("parameters", parameters);
  });

  socket.on("modelName", (value) => {
    modelName = value;
    socket.broadcast.emit("modelName", modelName);
  });
});



httpServer.listen(PORT, () => {
  console.log("socket and sapper running");
});
