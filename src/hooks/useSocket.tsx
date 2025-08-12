import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import {AppDispatch, RootState} from '../../store/store';
import {useAnalytics, useDevice, useStorage} from './index';
import {PLATFORM_SPECIFIED_CALLS} from '../../enums';
import {
  addNewEvent,
  addNewOrder,
  handleEventCount,
  handleEvents,
  handleOrderCount,
  handleOrders,
} from '../../store/slices/events';
// import { SERVER_URL } from '@env';
import { Event, Order } from '../../types';
import { BASE_SERVER_PORT } from '../service/fn';


type UseSocketReturnType = {
  socket: Socket | null;
};

const useSocket = (): UseSocketReturnType => {
  const d = useDispatch<AppDispatch>();
  const {deviceId, deviceName, ipv4} = useDevice();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const socketRef = useRef<Socket | null>(null);
  const {owner} = useAnalytics();
  const {getOrders, getEvents} = useStorage().user;
  const fetchOrders = async () => {
    const data = {
      query: {
        role: user.role,
        oid: owner._id,
      },
    };
    const res = await getOrders(data);
    if (res.success && res.data && res.data.orders) {
      d(handleOrders(res.data.orders));
    }
  };
  const fetchEvents = async () => {
    const data = {
      query: {
        role: user.role,
        oid: owner._id,
      },
    };
    const res = await getEvents(data);
    if (res.success && res.data && res.data.events) {
      d(handleEvents(res.data.events));
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!user?._id) return;
    if (socketRef.current?.connected) return;

    ipv4().then(ip => {
      if (!isMounted) return;
      socketRef.current = io(`http://${BASE_SERVER_PORT}:6900`, {
        transports: ['websocket'],
        query: {
          uid: String(user._id),
          deviceName,
          platform: String(PLATFORM_SPECIFIED_CALLS.MOBILE),
          role: user.role,
          deviceId,
          ipAddress: ip,
        },
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      socketRef.current.on('new_event', (s:Event) => {
        d(addNewEvent(s))
        d(handleEventCount(1));
        fetchEvents();
      });
      socketRef.current.on('new_order', (s:Order) => {
        d(addNewOrder(s))
        d(handleOrderCount(1));
        fetchOrders();
      });
      socketRef.current.on('order_status_updated', s => {
        console.log(s);
      });
      socketRef.current.on('balance_sheet_created', s => {
        console.log(s);
      });
      socketRef.current.on('connect_error', err => {
        console.log('Socket connection error:', err.message);
      });
    });

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id, deviceId, deviceName, user?.role]);

  return {
    socket: socketRef.current,
  };
};

export default useSocket;

export enum useSocketEvents {
  NEW_CUSTOMER = 'new_customer',
  NEW_EVENT = 'new_event',
  BALANCE_SHEET_CREATED = 'balance_sheet_created'
}
