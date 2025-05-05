import {Modal, StyleSheet, Pressable, View} from 'react-native';
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
  const translateY = useSharedValue(0);

  const closeSlideUpContainer = () => {
    childHeight.value = withTiming(0, {duration: 200});
    setTimeout(() => {
      close();
      translateY.value = 0;
    }, 200);
  };

  const childAnimatedStyles = useAnimatedStyle(() => {
    return {
      height: childHeight.value,
      transform: [{translateY: translateY.value}],
      justifyContent: 'flex-end',
      overflow: 'hidden',
    };
  });

  const dragTabGesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(e => {
      if (e.translationY > 100) {
        runOnJS(closeSlideUpContainer)();
      } else {
        translateY.value = withTiming(0, {duration: 150});
      }
    });

  useEffect(() => {
    if (open) {
      childHeight.value = 0;
      translateY.value = 0;
      setTimeout(() => {
        childHeight.value = withTiming(height + 30, {duration: 200});
      }, 40);
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
              backgroundColor: `rgba(0,0,0,${opacity})`,
              paddingHorizontal: padding ? 14 : 10,
            },
          ]}
          onPress={closeSlideUpContainer}>
          <Pressable onPress={e => e.stopPropagation()}>
            <Animated.View style={childAnimatedStyles}>
              <GestureDetector gesture={dragTabGesture}>
                <View style={styles.dragTabContainer}>
                  <View style={styles.dragTab} />
                </View>
              </GestureDetector>

              {/* Actual Children */}
              {children}
            </Animated.View>
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
    paddingHorizontal: 10,
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
