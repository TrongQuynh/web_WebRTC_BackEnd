const express = require('express');
const http = require("http");
const path = require('path');
const SocketServer = require('./socket-server');
const app = express();
const cors = require('cors');

const port = 8000;
const server = http.createServer(app);

const socketIO = new SocketServer(server);

// Body parser (Express 4.16+)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  // origin: ["http://localhost:3000"],
  origin: '*',
  credentials: true
}));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
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
