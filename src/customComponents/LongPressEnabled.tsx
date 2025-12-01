import { TouchableOpacity } from 'react-native';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useHaptics } from '../hooks';

type LongPressEnabledProps = {
  dummy?: boolean;
  children: ReactNode;
  minPressDuration?: number;
  longPressCanceledAction?: () => void;
  longPressAction?: () => void;
  hapticsEnabled?: boolean;
  vibrationDuration?: number;
  opacity?: number;
};

const LongPressEnabled: React.FC<LongPressEnabledProps> = ({
  dummy = false,
  children,
  minPressDuration = 400,
  longPressCanceledAction = () => {},
  longPressAction = () => {},
  hapticsEnabled = true,
  opacity = 0.8,
}) => {
  const { longPress } = useHaptics();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressed, setLongPressed] = useState(false);

  const triggerLongPress = () => {
    if (dummy) return;

    timeoutRef.current = setTimeout(() => {
      setLongPressed(true);
      longPressAction();
      if (hapticsEnabled) longPress();
    }, minPressDuration);
  };

  const cancelLongPress = () => {
    if (dummy) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset long press state for next touch
    setLongPressed(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
