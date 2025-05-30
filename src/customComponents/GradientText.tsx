import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = ({ text }: { text: string }) => {
  return (
    <MaskedView maskElement={<Text style={styles.maskedText}>{text}</Text>}>
      <LinearGradient
        colors={['#8e2de2', '#4a00e0', '#ff0080']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={[styles.maskedText, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskedText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GradientText;
