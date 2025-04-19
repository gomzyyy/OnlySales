import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '../hooks';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors, deviceHeight} from '../utils/Constants';

type Props = {
  title: string;
  subtitle?: string;
  buttonText: string;
  onPress?: () => void;
};

const SuccessScreen: React.FC<Props> = ({
  title,
  subtitle,
  buttonText,
  onPress,
}) => {
  const {currentTheme} = useTheme();

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      {/* <Image
        source={require('../assets/images/water.png')}
        style={styles.image}
        resizeMode="contain"
      /> */}
      <Icon name="flag-checkered" size={120} color={colors.oliveGreen} />
      <Text style={[styles.title, {color: currentTheme.baseColor}]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, {color: currentTheme.baseColor}]}>
          {subtitle}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[styles.button, {backgroundColor: currentTheme.baseColor}]}
        onPress={onPress}>
        <Text style={[styles.buttonText, {color: currentTheme.contrastColor}]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: deviceHeight * 0.4,
    marginBottom:10,
    borderRadius:20
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
