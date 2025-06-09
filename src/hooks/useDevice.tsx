import d from 'react-native-device-info';
import {getFCMToken} from '../api/fcm/fn';
import {NetworkInfo as n} from 'react-native-network-info';

export interface useDeviceReturnType {
  fmctoken: Promise<string>;
  deviceName: string;
  deviceId: string;
  ipv4: Promise<string | null>;
}

const useDevice = (): useDeviceReturnType => {
  const fmctoken = (async () => await getFCMToken())();
  const deviceName = String(d.getDeviceNameSync());
  const deviceId = String(d.getDeviceId());
  const ipv4 = (async () => await n.getIPV4Address())();

  return {
    fmctoken,
    deviceId,
    deviceName,
    ipv4,
  };
};
export default useDevice;
