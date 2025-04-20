import {View, StyleSheet, Text, ScrollView} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import AccountCenter from './components/AccountCenter';
import LogoutButton from './components/LogoutButton';
import AppSettings from './components/AppSettings';
import {useTheme} from '../../hooks';
import UserInfo from './components/UserInfo';
import BottomTabs from '../../components/BottomTabs';

const Settings = () => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;

  return (
    <View style={styles.parent}>
      <Header
        name="Settings"
        backButtom
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
      />
      <ScrollView
        style={[
          styles.settingsContainer,
          {backgroundColor: currentTheme.baseColor},
        ]}
        nestedScrollEnabled={true}>
        <View style={styles.infoContainer}>
          <UserInfo user={user} secure={true} profileImageValue={user?.image} />
        </View>
        <View style={styles.sectionsContainer}>
          <Text style={[styles.label, {color: currentTheme.contrastColor}]}>
            Account
          </Text>
          <AccountCenter />
        </View>
        <View style={styles.sectionsContainer}>
          <Text style={[styles.label, {color: currentTheme.contrastColor}]}>
            App
          </Text>
          <AppSettings />
        </View>
        <LogoutButton />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  infoContainer: {},
  settingsContainer: {
    paddingHorizontal: 10,
  },
  sectionsContainer: {
    marginTop: 20,
  },
  label: {fontSize: 30, fontWeight: 'bold', paddingHorizontal: 20},
});

export default Settings;
