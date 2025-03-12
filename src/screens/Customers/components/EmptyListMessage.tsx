import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

type EmptyListMessageProps = {
  textColor?: string;
};

const EmptyListMessage: React.FC<EmptyListMessageProps> = ({
  textColor = '#000',
}): React.JSX.Element => {
  return (
    <View style={styles.contaienr}>
      <Text style={[styles.textBold, {color: textColor}]}>
        Hurray! No Udhars.
      </Text>
      <Text style={[styles.textLight, {color: textColor}]}>
        Click on create button to create Udhar.
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
