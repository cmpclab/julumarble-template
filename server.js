const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server: http });
app.use(express.json());
app.use(express.static("public"));

let clients = [];
wss.on("connection", ws => {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
});

app.post("/toonation-webhook", (req, res) => {
  const { nickname, amount } = req.body;
  if (amount >= 1000) {
    const roll = Math.floor(Math.random() * 6) + 1;
    clients.forEach(ws => ws.send(JSON.stringify({ nickname, roll })));
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Listening on port ${PORT}`));
