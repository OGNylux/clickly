
export class Socket {
  private static instance: Socket;
  private ws: WebSocket;
  private constructor() {
    this.ws = new WebSocket('ws://johafo.de:18143/ws');
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