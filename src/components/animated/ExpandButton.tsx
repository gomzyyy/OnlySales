import { Pressable, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import { useTheme } from '../../hooks';

export type ActionButton = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

export type ExpandButtonProps = {
  btn: ActionButton;
  btn1?: ActionButton;
  btn2?: ActionButton;
  btn3?: ActionButton;
  btn4?: ActionButton;
};

const ExpandButton: React.FC<ExpandButtonProps> = ({ btn, btn1, btn2, btn3, btn4 }) => {
  const { currentTheme } = useTheme();
  const iconAngle = useSharedValue(0);
  const [btnExpanded, setBtnExpanded] = useState<boolean>(false);
  const actionBtnHeight = useSharedValue(50);
  const actionBtnBGOpacity = useSharedValue(0.08);

  const buttons = [btn, btn1, btn2, btn3, btn4].filter(Boolean) as ActionButton[];

  // Declare a fixed number of shared values and animated styles
  const buttonTranslations = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  const animatedTranslations = [
    useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslations[0].value }] })),
    useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslations[1].value }] })),
    useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslations[2].value }] })),
    useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslations[3].value }] })),
    useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslations[4].value }] })),
  ];

  const expandBtnAnimation = useAnimatedStyle(() => ({
    height: actionBtnHeight.value,
    backgroundColor: `rgba(0,0,0,${actionBtnBGOpacity.value})`,
  }));

  const expandBtnIconAnimation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconAngle.value}deg` }],
  }));

  useEffect(() => {
    actionBtnHeight.value = withTiming(btnExpanded ? 62 + buttons.length * 55 : 60, { duration: 200 });
    actionBtnBGOpacity.value = withTiming(btnExpanded ? 0.4 : 0.08, { duration: 200 });
    iconAngle.value = withTiming(btnExpanded ? 180 : 0, { duration: 200 });

    buttons.forEach((_, index) => {
      buttonTranslations[index].value = withTiming(btnExpanded ? -55 * (index + 1) : 0, { duration: 200 });
    });
  }, [btnExpanded]);

  const handleFn = (cb: () => void) => {
    setBtnExpanded(false);
    setTimeout(cb, 300);
  };

  return (
    <Animated.View
      style={[{
        borderRadius: 50,
        zIndex: 100,
        position: 'absolute',
        bottom: 80,
        right: 20,
        padding: 6,
        width: 60,
      }, expandBtnAnimation]}
    >
      <View
        style={{
          position: 'relative',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {buttons.map((button, index) => (
          <Pressable
            key={index}
            style={{ position: 'absolute' }}
            onPress={() => handleFn(button.onPress)}
          >
            <Animated.View
              style={[{
                borderRadius: 50,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 12,
                elevation: 2,
              }, animatedTranslations[index]]}
            >
              {button.icon}
              <Text numberOfLines={1} style={{ fontSize: 10,fontWeight:'600', color: currentTheme.baseColor }}>{button.label}</Text>
            </Animated.View>
          </Pressable>
        ))}
        <Pressable onPress={() => setBtnExpanded(!btnExpanded)}>
          <Animated.View
            style={[{
              borderRadius: 50,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
            }, expandBtnIconAnimation]}
          >
            <Icon1 name="caret-up" size={24} color={'rgba(0,0,0,0.8)'} />
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default ExpandButton;