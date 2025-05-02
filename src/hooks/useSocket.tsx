import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { RootState } from '../../store/store';

type UseSocketReturnType = {
  socket: Socket | null;
};

const SOCKET_URL = 'http://192.168.1.71:6900/';

const useSocket = (): UseSocketReturnType => {
  const user = useSelector((s: RootState) => s.appData.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        query: { uid: user._id },
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    console.log('Socket connected:', socketRef.current?.id);
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return {
    socket: socketRef.current,
  };
};

export default useSocket;
