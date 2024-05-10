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
  origin: '*'
}));

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
