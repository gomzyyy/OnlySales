import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {useTheme, useHaptics} from '../../../hooks';
import {navigate} from '../../../utils/nagivationUtils';

type PressableContainerProps = PropsWithChildren<{
  title: string;
  navigateTo?: string;
  onPress?:()=>void
}>;

const PressableContainer: React.FC<PressableContainerProps> = ({
  title,
  navigateTo,
  children,
  onPress
}) => {
  const {currentTheme} = useTheme();
  const {lightTap} = useHaptics();
  const handleNavigation = () => {
    lightTap();
    onPress && onPress()
   navigateTo && navigate(navigateTo);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.pressableContainer,
      ]}
      onPress={handleNavigation}>
      {children}
      <Text
      numberOfLines={1}
        style={[styles.pressableText, {color: currentTheme.baseColor}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
  },
  pressableText: {fontSize: 12, fontWeight: 'bold'},
});

export default PressableContainer;
