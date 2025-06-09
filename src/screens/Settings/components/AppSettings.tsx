import {View, StyleSheet} from 'react-native';
import React from 'react';
import Tab from './shared/Tab';
import {navigate} from '../../../utils/nagivationUtils';

const AppSettingsOptions = [
  {
    title: 'App Lock',
    navigateTo: 'SetPasscode',
    id: 1,
    description:
      'lock your business app and never let unknown users to access your business.',
  },
  {
    title: 'Themes',
    navigateTo: 'ChangeTheme',
    id: 2,
    description: 'you can choose app theme based on your choice.',
  },
  {
    title: 'App Info',
    navigateTo: 'AppInfo',
    id: 3,
    description: 'version, properties, accessibility, support; know your app better.',
  },
];

const AppSettings = () => {
  return (
    <View style={styles.accountOptionsContainer}>
      {AppSettingsOptions.map(s => (
        <Tab
          key={s.id}
          title={s.title}
          onPress={() => navigate(`${s.navigateTo}`)}
          description={s.description}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accountOptionsContainer: {marginTop: 20},
});

export default AppSettings;
