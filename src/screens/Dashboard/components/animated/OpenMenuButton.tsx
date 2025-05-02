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
      menuBtnX.value = withTiming(0, {
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
        menuBtnX.value = withTiming(0, {
          duration: 300,
        });
      }
    }, 300);
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {backgroundColor: 'rgba(0,0,0,0.02)'},
        menuBtnAnimatedStyles,
      ]}>
      <Pressable
        style={[styles.button, {backgroundColor: currentTheme.contrastColor}]}
        onPress={handleMenuBtnPress}>
        <Icon2 name="chevron-right" size={34} color={currentTheme.baseColor} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    zIndex: 10,
    // padding: 4,
    borderTopRightRadius: 40,
  },
  button: {
    width: 70,
    height: 60,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});

export default OpenMenuButton;
