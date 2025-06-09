import {View, StyleSheet, Text, ScrollView, Pressable} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import AccountCenter from './components/AccountCenter';
import LogoutButton from './components/LogoutButton';
import AppSettings from './components/AppSettings';
import {useTheme} from '../../hooks';
import UserInfo from './components/UserInfo';
import {navigate, resetAndNavigate} from '../../utils/nagivationUtils';
import {Confirm, showToast} from '../../service/fn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteUser} from '../../../store/slices/business';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Settings = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const handleOnLogout = async () => {
    const res = await Confirm(
      'Are you sure?',
      'this will log you out of this session.',
    );
    if (!res) return;
    await AsyncStorage.removeItem('accessToken');
    dispatch(deleteUser());
    showToast({type: 'success', text1: 'Logout success.'});
    resetAndNavigate('GetStarted');
  };
  return (
    <View style={styles.parent}>
      <Header
        name="Settings"
        backButton
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
        curved={true}
        customComponent={true}
        renderItem={
          <Icon name="logout" size={24} color={currentTheme.header.textColor} />
        }
        customAction={handleOnLogout}
      />
      <ScrollView
        style={[
          styles.settingsContainer,
          {backgroundColor: currentTheme.contrastColor},
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View style={styles.infoContainer}>
          <UserInfo user={user} secure={true} profileImageValue={user?.image} />
        </View>
        <View style={[styles.sectionsContainer]}>
          <Text style={[styles.label, {color: currentTheme.baseColor}]}>
            Account
          </Text>
          <AccountCenter />
        </View>
        <View style={[styles.sectionsContainer]}>
          <Text style={[styles.label, {color: currentTheme.baseColor}]}>
            App
          </Text>
          <AppSettings />
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: currentTheme.contrastColor,
          paddingBottom: 2,
          paddingHorizontal: 10,
          gap: 1,
        }}>
        <View style={{alignItems: 'center'}}>
          <Pressable onPress={() => navigate('TermsAndConditions')}>
            <Text
              style={{
                color: currentTheme.baseColor,
                fontSize: 12,
                textDecorationLine: 'underline',
              }}>
              Terms and Policy.
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  infoContainer: {
    marginTop: 30,
  },
  settingsContainer: {
    paddingHorizontal: 10,
  },
  sectionsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  label: {fontSize: 30, fontWeight: 'bold', paddingHorizontal: 20},
});

export default Settings;
