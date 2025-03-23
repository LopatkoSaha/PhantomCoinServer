import WebSocket, {WebSocketServer} from "ws";

export class WSServer {
    private wss: WebSocketServer;

    constructor (private path: string, port: number, private welcomeCb: (channel: string) => Promise<any>) {
      this.wss = new WebSocketServer({ port, path });
      this.wss.on("connection", (ws, req) => this.connection(ws, req));
      console.log(`🚀 WebSocket сервер ${this.path} запущен на ws://localhost:${port}`);
    }

    private async connection(ws: WebSocket, req: any) {
        const channel = req.url.split("?")[1]?.split("=")[1];
      
        ws.send(JSON.stringify(await this.welcomeCb(channel)));
        console.log(`🔗 Клиент подключился к ${this.path}`);
        ws.on("close", () => this.close(ws));
      }
      // Отправляет всем
    public broadcast(message: string) {
      this.wss.clients.forEach((client) => {
        
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }

    public send(channel: string, message: string) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
    
    private close(ws: WebSocket) {
      console.log(`❌ Клиент отключился от ${this.path}`);
    }
}
