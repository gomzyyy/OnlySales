import {View, StyleSheet} from 'react-native';
import React from 'react';
import Tab from './shared/Tab';
import {navigate} from '../../../utils/nagivationUtils';

const AppSettingsOptions = [
  {title: 'App Lock', navigateTo: 'SetPasscode', id: 1},
  {title: 'Themes', navigateTo: 'ChangeTheme', id: 2},
  {title: 'App Info', navigateTo: 'AppInfo', id: 3},
];

const AppSettings = () => {
  return (
    <View style={styles.accountOptionsContainer}>
      {AppSettingsOptions.map(s => (
        <Tab
          key={s.id}
          title={s.title}
          onPress={() => navigate(`${s.navigateTo}`)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accountOptionsContainer: {marginTop: 20},
});

export default AppSettings;
