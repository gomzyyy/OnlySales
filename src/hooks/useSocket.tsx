import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import {AppDispatch, RootState} from '../../store/store';
import {useAnalytics, useDevice, useStorage} from './index';
import {PLATFORM_SPECIFIED_CALLS} from '../../enums';
import {
  addNewEvent,
  addNewOrder,
  handleEvents,
  handleOrders,
} from '../../store/slices/events';
import {BusinessTiming, Event, Order} from '../../types';
import {BASE_SERVER_PORT} from '../service/fn';
import {updateBusinessTimings} from '../../store/slices/openClose';

type UseSocketReturnType = {
  socket: Socket | null;
  isConnected:boolean;
};

const useSocket = (): UseSocketReturnType => {
  const d = useDispatch<AppDispatch>();
  const {deviceId, deviceName, ipv4} = useDevice();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const socketRef = useRef<Socket | null>(null);

  // STATES

  const [isConnected, setIsConnected] = useState<boolean>(false);

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
     const {connected} = socketRef.current = io(`http://${BASE_SERVER_PORT}:6900`, {
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
      setIsConnected(connected)
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      socketRef.current.on('isopen_status_updated_success', s =>
        console.log(s),
      );
      socketRef.current.on('new_event', (s: Event) => {
        d(addNewEvent(s));
        fetchEvents();
      });
      socketRef.current.on('new_order', (s: Order) => {
        d(addNewOrder(s));
        fetchOrders();
      });
       socketRef.current.on('address_updated', (data) => {
        console.log(data)
      });
      socketRef.current.on('order_status_updated', s => {
        console.log(s);
      });
      socketRef.current.on('business_timing_updated', (s: BusinessTiming[]) => {
        d(updateBusinessTimings(s));
        console.log(s);
      });
      socketRef.current.on('balance_sheet_created', s => {
        console.log(s);
      });
      socketRef.current.on('connect_error', err => {
        console.log('Socket connection error:', err.message);
      });
      socketRef.current.on('get_online_users', (d) => console.log("CURRENT ONLINE USERS",d));
      socketRef.current.on('get_online_users_meta_data', (d) => console.log("CURRENT ONLINE USER's META DATA",d));
    });

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id, deviceId, deviceName, user?.role,isConnected]);

  return {
    socket: socketRef.current,
    isConnected
  };
};

export default useSocket;

export enum useSocketEvents {
  NEW_CUSTOMER = 'new_customer',
  NEW_EVENT = 'new_event',
  BALANCE_SHEET_CREATED = 'balance_sheet_created',
}
