import {Modal, StyleSheet, Pressable, View, StatusBar} from 'react-native';
import React, {PropsWithChildren, useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {deviceHeight} from '../utils/Constants';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

type SlideUpContainerProps = PropsWithChildren<{
  open: boolean;
  close: () => void;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  padding?: boolean;
  height?: number;
  heightLimit?: number;
  bottom?: boolean;
  usepadding?: boolean;
}>;

const SlideUpContainer: React.FC<SlideUpContainerProps> = ({
  children,
  open,
  close,
  opacity = 0.1,
  padding = false,
  height = deviceHeight,
  heightLimit,
  bottom = true,
  usepadding = true,
}): React.JSX.Element => {
  const sheetHeight =
    typeof heightLimit === "number" && height > heightLimit
      ? heightLimit
      : height;

  const translateY = useSharedValue(sheetHeight);

  const closeSlideUpContainer = () => {
    translateY.value = withTiming(sheetHeight, { duration: 200 });
    setTimeout(() => {
      close();
    }, 200);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        runOnJS(closeSlideUpContainer)();
      } else {
        translateY.value = withTiming(0, { duration: 150 });
      }
    });

  useEffect(() => {
    if (open) {
      translateY.value = sheetHeight;
      setTimeout(() => {
        translateY.value = withTiming(0, { duration: 200 });
      }, 10);
    }
  }, [open, height]);

  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={open}
      onRequestClose={closeSlideUpContainer}
      hardwareAccelerated>
      <GestureHandlerRootView style={{flex: 1}}>
        <Pressable
          style={[
            styles.childContainer,
            {
              backgroundColor: `rgba(0,0,0,0.6)`,
              paddingHorizontal: usepadding ? (padding ? 14 : 10) : 0,
            },
          ]}
          onPress={closeSlideUpContainer}>
          <Pressable onPress={e => e.stopPropagation()}>
            <GestureDetector gesture={dragGesture}>
              <Animated.View style={animatedStyles}>
                <View style={styles.dragTabContainer}>
                  <View style={styles.dragTab} />
                </View>
                {children}
              </Animated.View>
            </GestureDetector>
          </Pressable>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dragTabContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ccc0',
  },
  dragTab: {
    width: 40,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
});

export default SlideUpContainer;
