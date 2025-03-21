import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../../hooks';

type FloatingPayButtonProps={
pressAction:()=>void
}

const FloatingPayButton:React.FC<FloatingPayButtonProps> = ({pressAction}):React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.baseColor,
          borderColor: currentTheme.contrastColor,
        },
      ]}
      activeOpacity={0.8}
      onPress={pressAction}
      >
      <View style={styles.icon}>
        <Icon
          name="qr-code-scanner"
          size={26}
          color={currentTheme.contrastColor}
        />
        <Text style={[styles.iconText, {color: currentTheme.contrastColor}]}>
          Req. Money
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    paddingHorizontal: 8,
    paddingVertical: 14,
    zIndex: 99,
    boxSizing: 'border-box',
    borderRadius: '40%',
    borderWidth: 3,
    elevation: 30,
  },
  icon: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
export default FloatingPayButton;
