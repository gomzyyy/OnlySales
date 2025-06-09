import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import {RootState} from '../../store/store';
import {useDevice} from './index';
import {PLATFORM_SPECIFIED_CALLS} from '../../enums';

type UseSocketReturnType = {
  socket: Socket | null;
};

const SOCKET_URL = 'http://192.168.1.71:6900/';

const useSocket = (): UseSocketReturnType => {
  const {deviceId, deviceName} = useDevice();
  const user = useSelector((s: RootState) => s.appData.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    if (socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        uid: String(user._id),
        deviceName,
        platform: String(PLATFORM_SPECIFIED_CALLS.MOBILE),
        role: user.role,
        deviceId,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    socketRef.current.on('new_event', s => console.log(s));
    socketRef.current.on('connect_error', err => {
      console.log('Socket connection error:', err.message);
    });

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
