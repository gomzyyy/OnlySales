import React, {useEffect} from 'react';
import Icon2 from 'react-native-vector-icons/Feather';
import {useTheme} from '../../../../hooks';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';

type OpenMenuButtonProps = {
  open: boolean;
};

const OpenMenuButton: React.FC<OpenMenuButtonProps> = ({
  open,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const navigation = useNavigation();

  const menuBtnX = useSharedValue(-100);

  const menuBtnAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: menuBtnX.value}],
  }));

  useEffect(() => {
    if (open) {
      menuBtnX.value = withTiming(10, {
        duration: 300,
        // damping: 14,
        // stiffness: 100,
      });
    } else {
      menuBtnX.value = withTiming(-100, {
        duration: 300,
      });
    }
  }, [open]);

  const handleMenuBtnPress = () => {
    menuBtnX.value = withTiming(-100, {
      duration: 100,
    });
    setTimeout(() => {
      navigation.dispatch(DrawerActions.openDrawer());
    }, 300);
    setTimeout(() => {
      if (open) {
        menuBtnX.value = withTiming(10, {
          duration: 300,
        });
      }
    }, 300);
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        menuBtnAnimatedStyles,
      ]}>
      <Pressable
        style={[styles.button, {backgroundColor: currentTheme.baseColor}]}
        onPress={handleMenuBtnPress}>
        <Icon2 name="menu" size={26} color={currentTheme.contrastColor} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    zIndex: 10,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OpenMenuButton;
