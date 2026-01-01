import { Modal, StyleSheet, Pressable, View, Dimensions } from 'react-native';
import React, { PropsWithChildren, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import ToastProvider from "react-native-toast-message"
// import { toastConfig } from '@/config';

const deviceHeight = Dimensions.get('window').height;
const DEFAULT_MIN_Y_TO_CLOSE = 120

type SlideUpContainerProps = PropsWithChildren<{
  open: boolean;
  close: () => void;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  padding?: boolean;
  height?: number;
  heightLimit?: number;
  bottom?: boolean;
  usepadding?: boolean;
  gestureEnabled?: boolean;
  showGestureTab?:boolean;
  borderRounded?: boolean;
  minY?:number;
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
  gestureEnabled = true,
  showGestureTab = true,
  borderRounded = true,
  minY = DEFAULT_MIN_Y_TO_CLOSE
}) => {
  const sheetHeight =
    typeof heightLimit === 'number' && height > heightLimit
      ? heightLimit
      : height;

  const translateY = useSharedValue(sheetHeight);

  const closeSlideUpContainer = () => {
    translateY.value = withTiming(sheetHeight, { duration: 200 });
    setTimeout(close, 200);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Gesture: simultaneous with native so FlatList can receive scroll touches.
const dragGesture = Gesture.Pan()
  .simultaneousWithExternalGesture(Gesture.Native())
  .onUpdate((e) => {
    // ⛔ Ignore upward swipe
    if (e.translationY <= 0) return;

    translateY.value = e.translationY;
  })
  .onEnd((e) => {
    // ⛔ Ignore upward swipe completely
    if (e.translationY <= 0) {
      translateY.value = withTiming(0, { duration: 150 });
      return;
    }

    if (e.translationY > minY) {
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
  }, [open, sheetHeight]);

  const GestureEnabledView = ({ children }: PropsWithChildren) => {
    if (gestureEnabled) {
      return (
        <GestureDetector gesture={dragGesture}>{children}</GestureDetector>
      );
    }
    return <>{children}</>;
  };

  return (
    <Modal
      animationType="fade"
      transparent
      statusBarTranslucent
      visible={open}
      onRequestClose={closeSlideUpContainer}
      hardwareAccelerated
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable
          style={[
            styles.childContainer,
            {
              backgroundColor: `rgba(0,0,0,${opacity})`,
              paddingHorizontal: usepadding ? (padding ? 14 : 10) : 0,
            },
          ]}
          onPress={closeSlideUpContainer}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <GestureEnabledView>
              <Animated.View style={[animatedStyles, { height: sheetHeight }]}>
                <View
                  style={[
                    styles.dragTabContainer,
                    {
                      borderTopRightRadius: borderRounded ? 18 : undefined,
                      borderTopLeftRadius: borderRounded ? 18 : undefined,
                    },
                  ]}
                >
                  {gestureEnabled && (showGestureTab && <View style={styles.dragTab} />)}
                </View>

                {/* CRITICAL: children must be inside a flex container */}
                <View style={styles.content}>{children}</View>
              </Animated.View>
            </GestureEnabledView>
          </Pressable>
        </Pressable>
      </GestureHandlerRootView>
      {/* <ToastProvider config={toastConfig}/> */}
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
    backgroundColor: '#fff',
    zIndex:999
  },
  dragTab: {
    width: 60,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#898989ff',
  },
  content: {
    flex: 1, // <-- REQUIRED so FlatList has room to scroll
  },
});

export default SlideUpContainer;