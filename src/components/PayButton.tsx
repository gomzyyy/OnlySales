import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../hooks';
import {isNumber} from '../service/test';

type PayButtonProps = {
  label?: string;
  pressAction?: () => void;
};

const PayButton: React.FC<PayButtonProps> = ({
  label = 'Pay',
  pressAction = () => {},
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={pressAction}
      style={[
        styles.parent,
        {
          borderColor: currentTheme.contrastColor,
          backgroundColor: currentTheme.contrastColor,
        },
      ]}>
      <Text style={[styles.innerText, {color: currentTheme.baseColor}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  parent: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 5,
  },
  innerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PayButton;
