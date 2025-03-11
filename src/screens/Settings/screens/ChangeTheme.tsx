import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../../components/Header';
import ThemePicker from '../components/ThemePicker';
import {useTheme} from '../../../hooks/index';

const ChangeTheme = () => {
  const {currentTheme} = useTheme();
  return (
    <View style={styles.parent}>
      <Header backButtom showTitle={false} />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>
          Please Choose a theme as per your preference.
        </Text>
        <View style={styles.themePickerContainer}>
          <Text style={styles.currentThemeText}>
            Current theme: {currentTheme.name}
          </Text>
          <ThemePicker />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  container: {paddingHorizontal: 10},
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 140,
  },
  themePickerContainer: {
    marginTop: 50,
    paddingHorizontal: 30,
  },
  currentThemeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChangeTheme;
