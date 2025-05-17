import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {useTheme, useHaptics} from '../../../hooks';
import {navigate} from '../../../utils/nagivationUtils';

type PressableContainerProps = PropsWithChildren<{
  title: string;
  navigateTo: string;
}>;

const PressableContainer: React.FC<PressableContainerProps> = ({
  title,
  navigateTo,
  children,
}) => {
  const {currentTheme} = useTheme();
  const {lightTap} = useHaptics();
  const handleNavigation = () => {
    lightTap();
    navigate(navigateTo);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.pressableContainer,
        {backgroundColor: currentTheme.baseColor},
      ]}
      onPress={handleNavigation}>
      {children}
      <Text
        style={[styles.pressableText, {color: currentTheme.header.textColor}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    height: 60,
    width: 150,
    justifyContent: 'center',
  },
  pressableText: {fontSize: 18, fontWeight: 'bold'},
});

export default PressableContainer;
