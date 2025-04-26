import {Modal, StyleSheet, Pressable} from 'react-native';
import React, {PropsWithChildren, useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {deviceHeight} from '../utils/Constants';

type SlideUpContainerProps = PropsWithChildren<{
  open: boolean;
  close: () => void;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  padding?: boolean;
  height?: number;
}>;

const SlideUpContainer: React.FC<SlideUpContainerProps> = ({
  children,
  open,
  close,
  opacity = 0.1,
  padding = false,
  height = deviceHeight,
}): React.JSX.Element => {
  const childHeight = useSharedValue(0);
  const childAnimatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(childHeight.value, {
        duration: 200,
      }),
      justifyContent: 'flex-end',
      overflow:'hidden'
    };
  });

  const closeSlideUpContainer = () => {
    childHeight.value = 0;
    setTimeout(() => {
      close();
    }, 160);
  };

  useEffect(() => {
    if(open){
      childHeight.value = 0;
      setTimeout(() => (childHeight.value = height+30), 40);
    }
  }, [open,height]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      onRequestClose={closeSlideUpContainer}
      hardwareAccelerated={true}
      >
      <Pressable
        style={[
          styles.childContainer,
          {
            backgroundColor: `rgba(0,0,0,${'0.5'})`,
            paddingHorizontal: padding ? 14 : 10,
          },
        ]}
        onPress={closeSlideUpContainer}>
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View style={childAnimatedStyles}>{children}</Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
});

export default SlideUpContainer;
