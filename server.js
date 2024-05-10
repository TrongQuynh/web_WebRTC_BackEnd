const express = require('express');
const http = require("http");
const path = require('path');
const SocketServer = require('./socket-server');
const SOCKET_ENUM = require("./enums/socket-event.enum");
const app = express();
const cors = require('cors');
const { Server } = require('socket.io');

const port = 8000;
const server = http.createServer(app);

// const socketIO = new SocketServer(server);

const socketIO = new Server(server, {
  cors:'*',
  transports: ['websocket']
});

socketIO.on(SOCKET_ENUM.SOCKET_CONNECTION, socket => {
  console.log("[SOCKET-SERVER]: SOMEONE IS COMMING");
})

// Body parser (Express 4.16+)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  next();
});

app.use(express.static(path.join(__dirname, "/public")));

// APIS

app.get("/health-check", function(req, res){
  console.log("");
  return res.json({
    message: "OK",
    status: 200,
    data: null  
  })
})

app.get("/", function (req, res) {
  return res.redirect("/health-check");
})

server.listen(port, () => {
  console.log("[Server] run at Port: ", port);
})
