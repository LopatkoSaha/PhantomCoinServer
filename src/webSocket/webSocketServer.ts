import WebSocket, {WebSocketServer} from "ws";
import { wsPort } from "../../config/config"

class WSServer {
    private wss: WebSocketServer;

    constructor () {
      this.wss = new WebSocketServer({ port: wsPort });
      this.wss.on("connection", (ws) => this.connection(ws));
      console.log(`🚀 WebSocket сервер запущен на ws://localhost:${wsPort}`);
    }

    private connection(ws: WebSocket) {
        console.log("🔗 Клиент подключился");
        ws.on("close", () => this.close(ws));
      }
    
    public send(message: string) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
    
    private close(ws: WebSocket) {
      console.log("❌ Клиент отключился");
    }
}

export const wsServer = new WSServer();