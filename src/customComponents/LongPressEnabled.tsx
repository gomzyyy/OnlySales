import {TouchableOpacity, Vibration} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';

type LongPressEnabledProps = {
  dummy?: boolean;
  children: ReactNode;
  minPressDuration?: number;
  longPressCanceledAction?: () => void;
  longPressAction: () => void;
  vibrateOnLongPress?: boolean;
  vibrationDuration?: number;
};

const LongPressEnabled: React.FC<LongPressEnabledProps> = ({
  dummy = false,
  children,
  minPressDuration = 300,
  longPressCanceledAction = () => {},
  longPressAction,
  vibrateOnLongPress = true,
  vibrationDuration = 50,
}): React.JSX.Element => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressed, setLongPressed] = useState<boolean>(false);

  const triggerLongPress = () => {
    if (dummy) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      longPressAction();
      setLongPressed(true);
      if (vibrateOnLongPress) {
        Vibration.vibrate(vibrationDuration);
      }
    }, minPressDuration);
  };
  const cancelLongPress = () => {
    if (dummy) {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setLongPressed(false);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => !longPressed && !dummy && longPressCanceledAction()}
      onPressIn={triggerLongPress}
      onPressOut={cancelLongPress}>
      {children}
    </TouchableOpacity>
  );
};

export default LongPressEnabled;
