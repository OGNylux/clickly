
export class Socket {
  private static instance: Socket;
  private ws: WebSocket;
  private constructor() {
    this.ws = new WebSocket('wss://johafo.de:14133/ws');
  }
  public static getInstance() {
    if (!Socket.instance) {
      Socket.instance = new Socket();
    }
    return Socket.instance;
  }

  public getSocket() {
    return this.ws;
  }
}