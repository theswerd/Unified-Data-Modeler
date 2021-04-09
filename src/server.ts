import sirv from "sirv";
import compression from "compression";
import * as sapper from "@sapper/server";
import express from "express";
import HttpServer from "http";
import { Server } from "socket.io";

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

io.on("connection", (socket) => {
	console.log('CONNECTION')
  socket.on('test', (_) => {
    console.log('TEST')
    socket.emit('ok', {'test':'test'})
  });
});



httpServer.listen(PORT, () => {
  console.log("socket and sapper running");
});
