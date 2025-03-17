import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

type EmptyListMessageProps = {
  title: string;
  context?: string;
  textColor?: string;
};

const EmptyListMessage: React.FC<EmptyListMessageProps> = ({
  title,
  context = '',
  textColor = '#000',
}): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={[styles.textBold, {color: textColor}]}>{title}</Text>
      <Text style={[styles.textLight, {color: textColor}]}>{context}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBold: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textLight: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '400',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default EmptyListMessage;
