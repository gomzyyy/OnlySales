import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '../hooks';

type FallbackMessage = {
  text: string;
};

const FallbackMessage: React.FC<FallbackMessage> = ({
  text,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <View
      style={[
        styles.assistTextContainer,
        {backgroundColor: currentTheme.fadeColor},
      ]}>
      <Text style={[styles.assistText, {color: currentTheme.baseColor}]}>
        {text}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  assistTextContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 40,
  },
  assistText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default FallbackMessage;
