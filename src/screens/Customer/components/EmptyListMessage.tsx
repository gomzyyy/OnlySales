import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

type EmptyListMessageProps = {title: string; context: string};

const EmptyListMessage: React.FC<EmptyListMessageProps> = ({
  title,
  context,
}): React.JSX.Element => {
  return (
    <View style={styles.contaienr}>
      <Text style={styles.textBold}>{title}</Text>
      <Text style={styles.textLight}>
       {context}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  contaienr: {
    flex: 1,
  },
  textBold: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  textLight: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 24,
    fontWeight: '400',
    paddingHorizontal: 20,
  },
});

export default EmptyListMessage;
