import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {useTheme} from '../hooks/index';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import LongPressEnabled from '../customComponents/LongPressEnabled';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

type CreateButtomProps = {
  open: () => void;
};

const CreateButton: React.FC<CreateButtomProps> = ({open}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const fromRight = useSharedValue(-60);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [dragEnabled, setDragEnabled] = useState(false);

  useEffect(() => {
    fromRight.value = withTiming(22, {duration: 500});
    return () => {
      fromRight.value = withTiming(-60, {duration: 100});
    };
  }, []);

  const btnAnimatedStyles = useAnimatedStyle(() => ({
    bottom: 90,
    right: fromRight.value,
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  const dragGestureHandler = Gesture.Pan()
    .onUpdate(e => {
      if (dragEnabled) {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (dragEnabled) runOnJS(setDragEnabled)(false);
    });

  const onLongPress = () => {
    setDragEnabled(true);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.baseColor,
          borderColor: currentTheme.contrastColor,
        },
        btnAnimatedStyles,
      ]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={dragGestureHandler}>
          <LongPressEnabled
            opacity={0.8}
            longPressCanceledAction={open}
            longPressAction={onLongPress}>
            <View>
              <Icon
                name="circle-with-plus"
                size={26}
                color={currentTheme.contrastColor}
              />
            </View>
          </LongPressEnabled>
        </GestureDetector>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 16,
    zIndex: 99,
    borderRadius: 40,
    borderWidth: 3,
    elevation: 30,
  },
});

export default CreateButton;
