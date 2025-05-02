import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {navigate} from '../../utils/nagivationUtils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {navigationRef} from '../../utils/nagivationUtils';
const NoProfile = require('../../assets/images/no-profile.jpg');
import {useTheme} from '../../hooks/index';
import LogoutButton from '../../screens/Settings/components/LogoutButton';
import MenuTab, {AppSettingsData, ManagementData, ToolsData} from './menu_data';
import { deviceHeight } from '../../utils/Constants';

const MenuContent: React.FC<DrawerContentComponentProps> = (
  props,
): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const currRoute = navigationRef.current?.getCurrentRoute()?.name;
  const navigation = useNavigation();
  const user = useSelector((s: RootState) => s.appData.user);

  const handleNavigationByMenu = (r: string): void => {
    if (currRoute === r) {
      navigation.dispatch(DrawerActions.closeDrawer());
      return;
    }
    navigate(r);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: currentTheme.contrastColor},
        ]}>
        <Text style={{textAlign: 'center', marginTop: 50, fontSize: 16}}>
          Loading user...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <View style={styles.innterContainer}>
        <View
          style={[
            styles.infoContainer,
            {backgroundColor: currentTheme.baseColor},
          ]}>
          <View
            style={{
              backgroundColor: currentTheme.contrastColor,
              position: 'absolute',
              paddingHorizontal: 4,
              paddingVertical: 2,
              borderRadius: 6,
              right: 10,
              top: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: currentTheme.baseColor,
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: 14,
                fontWeight: '600',
              }}>
              {user?.role?.toLowerCase() || 'guest'}
            </Text>
          </View>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                user.image && user.image.trim().length !== 0
                  ? {uri: user.image}
                  : NoProfile
              }
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileNameContainer}>
            <Text
              style={[styles.profileName, {color: currentTheme.contrastColor}]}>
              {user?.name || 'Anonymous'}
            </Text>
          </View>
        </View>
      </View>
      <DrawerContentScrollView
        style={{flex: 1}}
        contentContainerStyle={{height: '80%'}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        {...props}>
        <ScrollView
          style={{borderRadius: 20}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 10}}>
          <View
            style={[
              styles.navigtionTabContainer,
              {backgroundColor: currentTheme.fadeColor},
            ]}>
            <View style={{paddingHorizontal: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: currentTheme.baseColor,
                }}>
                Management
              </Text>
            </View>
            {ManagementData.map((m, i) => (
              <MenuTab tabData={m} key={i} />
            ))}
          </View>
          <View
            style={[
              styles.navigtionTabContainer,
              {backgroundColor: currentTheme.fadeColor},
            ]}>
            <View style={{paddingHorizontal: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: currentTheme.baseColor,
                }}>
                Business & Tools
              </Text>
            </View>
            {ToolsData.map((m, i) => (
              <MenuTab tabData={m} key={i} />
            ))}
          </View>

          <View
            style={[
              styles.navigtionTabContainer,
              {backgroundColor: currentTheme.fadeColor},
            ]}>
            <View style={{paddingHorizontal: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: currentTheme.baseColor,
                }}>
                User & App
              </Text>
            </View>
            {AppSettingsData.map((m, i) => (
              <MenuTab tabData={m} key={i} />
            ))}
          </View>
        </ScrollView>
      </DrawerContentScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          width: '100%',
          paddingHorizontal: 10,
          backgroundColor: currentTheme.contrastColor
        }}>
        <LogoutButton theme="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingRight: 10,
  },
  innterContainer: {
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 15,
    height: 110,
  },
  profileImageContainer: {
    height: 70,
    width: 70,
    borderRadius: 45,
    overflow: 'hidden',
  },
  profileImage: {
    height: '100%',
    width: 'auto',
  },
  profileNameContainer: {},
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navigtionTabContainer: {
    gap: 10,
    paddingRight: 40,
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 20,
    height: '80%',
    flex: 1,
  },
});

export default MenuContent;
