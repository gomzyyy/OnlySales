import io, {Socket} from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.71:6900';

class WSService {
  socket: Socket | null = null;
  initializeSocket = async () => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
      console.log('initializing socket', this.socket);

      this.socket.on('socket', () => {
        console.log('=== socket connected ====');
      });

      this.socket.on('disconnect', () => {
        console.log('=== socket disconnected ====');
      });

      this.socket.on('error', data => {
        console.log('socket error', data);
      });
    } catch (error) {
      console.log('socket is not inialized', error);
    }
  };

  emit(event: string, data: any = {}) {
    this.socket?.emit(event, data);
  }

  on(event: string, cb = () => {}) {
    this.socket?.on(event, cb);
  }

  removeListener(listenerName: string) {
    this.socket?.removeListener(listenerName);
  }
}

const socketServcies = new WSService();

export default socketServcies;
