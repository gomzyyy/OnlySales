import {TouchableOpacity, Pressable} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';

type TabProps = {
  lastIndex?: boolean;
  dummy?: boolean;
  children: ReactNode;
  minPressDuration?: number;
  longPressCanceledAction?: () => void;
  longPressAction: () => void;
};

const LongPressEnabled: React.FC<TabProps> = ({
  dummy = false,
  children,
  minPressDuration = 200,
  longPressCanceledAction = () => {},
  longPressAction,
}): React.JSX.Element => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressed, setLongPressed] = useState<boolean>();

  const triggerLongPress = () => {
    timeoutRef.current = setTimeout(() => {
      longPressAction();
      setLongPressed(true);
    }, minPressDuration);
  };
  const cancelLongPress = () => {
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
