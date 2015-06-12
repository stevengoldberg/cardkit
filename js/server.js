// This server just broadcasts all messages to all clients.

const WebSocketServer = require("ws").Server

let wss = new WebSocketServer({port: 9090})

class Connection {
  constructor(ws) {
    this.ws = ws

    console.log(`hello ${this.clientName()}`)

    // Connection.all maps client names to connected clients
    if (Connection.all === undefined) {
      Connection.all = {}
    }
    Connection.all[this.clientName()] = this
  }

  clientName() {
    return `${this.ws._socket.remoteAddress}:${this.ws._socket.remotePort}`
  }

  close() {
    console.log(`goodbye ${this.clientName()}`)
    delete Connection.all[this.clientName()]
  }
}

wss.on("connection", function(ws) {
  let connection = new Connection(ws)

  ws.on("message", function(message) {
    console.log("bouncing: %s", message)

    for (let client of wss.clients) {
      client.send(message)
    }
  })

  ws.on("close", () => connection.close())

  ws.send("hello")
})

console.log("server running...")
