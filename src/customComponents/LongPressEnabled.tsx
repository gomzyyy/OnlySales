import {TouchableOpacity} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import useHaptics from '../hooks/useHaptics';

type LongPressEnabledProps = {
  dummy?: boolean;
  children: ReactNode;
  minPressDuration?: number;
  longPressCanceledAction?: () => void;
  longPressAction: () => void;
  hapticsEnabled?: boolean;
  vibrationDuration?: number;
};

const LongPressEnabled: React.FC<LongPressEnabledProps> = ({
  dummy = false,
  children,
  minPressDuration = 400,
  longPressCanceledAction = () => {},
  longPressAction,
  hapticsEnabled = true,
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
      activeOpacity={0.8}
      onPress={() => !longPressed && !dummy && longPressCanceledAction()}
      onPressIn={triggerLongPress}
      onPressOut={cancelLongPress}>
      {children}
    </TouchableOpacity>
  );
};

export default LongPressEnabled;
