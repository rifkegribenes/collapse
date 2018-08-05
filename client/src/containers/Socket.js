import io from 'socket.io-client';


export default class Socket {
  constructor() {
    const origin = window.location.origin;
    const url = (origin.includes('localhost')) ? 'http://localhost:3001/' : origin
    this.socket = io(url);
  }

  stockChange(method, data) {
    console.log(method);
    console.log(data);

    this.socket.emit('stock change', method, data);
  }

  onStockChange(callback, data) {
    console.log(callback);
    console.log(data);
    this.socket.on('stock changed', callback, data);
  }
}