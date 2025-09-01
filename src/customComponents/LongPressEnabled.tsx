import {TouchableOpacity} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import {useHaptics} from '../hooks/index';

type LongPressEnabledProps = {
  dummy?: boolean;
  children: ReactNode;
  minPressDuration?: number;
  longPressCanceledAction?: () => void;
  longPressAction?: () => void;
  hapticsEnabled?: boolean;
  vibrationDuration?: number;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
};

const LongPressEnabled: React. FC<LongPressEnabledProps> = ({
  dummy = false,
  children,
  minPressDuration = 400,
  longPressCanceledAction = () => {},
  longPressAction=()=>{},
  hapticsEnabled = true,
  opacity=0.8
}): React.JSX.Element => {
  const {longPress} = useHaptics();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressed, setLongPressed] = useState<boolean>(false);

  const triggerLongPress = () => {
    if (dummy) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      longPressAction();
      setLongPressed(true);
      if (hapticsEnabled) {
        longPress();
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
      activeOpacity={opacity}
      onPress={() => !longPressed && !dummy && longPressCanceledAction()}
      onPressIn={triggerLongPress}
      onPressOut={cancelLongPress}
      >
      {children}
    </TouchableOpacity>
  );
};

export default LongPressEnabled;
