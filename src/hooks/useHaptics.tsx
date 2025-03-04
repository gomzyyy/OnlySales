import {Vibration} from 'react-native';

export interface useHapticsReturnType {
  lightTap: () => void;
  longPress: () => void;
  warning: () => void;
  success: () => void;
  error: () => void;
  removed: () => void;
};

export enum Haptics {
  lightTap = 'lightTap',
  longPress = 'longPress',
  warning = 'warning',
  success = 'success',
  error = 'error',
  removed = 'delete'
}

const useHaptics = (): useHapticsReturnType => {
  const lightTap = () => Vibration.vibrate(20);
  const longPress = () => Vibration.vibrate(50);
  const warning = () => Vibration.vibrate(90);
  const success = () => Vibration.vibrate(20);
  const error = () => Vibration.vibrate([20, 15, 20]);
  const removed = () => Vibration.vibrate(20);
  return {
    lightTap,
    longPress,
    warning,
    success,
    error,
    removed
  };
};

export default useHaptics;
