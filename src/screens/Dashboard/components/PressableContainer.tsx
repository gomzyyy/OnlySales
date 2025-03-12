import {Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {useTheme} from '../../../hooks';
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
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.pressableContainer,
        {backgroundColor: currentTheme.baseColor},
      ]}
      onPress={() => navigate(navigateTo)}>
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
    padding: 22,
    borderRadius: 16,
  },
  pressableText: {fontSize: 22, fontWeight: 'bold'},
});

export default PressableContainer;
