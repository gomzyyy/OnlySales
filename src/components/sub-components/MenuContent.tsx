import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
const NoProfile = require('../../assets/images/no-profile.jpg');
import {useTheme} from '../../hooks/index';
import LogoutButton from '../../screens/Settings/components/LogoutButton';
import MenuTab, {AppSettingsData, ManagementData, ToolsData} from './menu_data';

const MenuContent: React.FC<DrawerContentComponentProps> = (
  props,
): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user);

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: currentTheme.contrastColor},
        ]}>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 50,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Please Login to see data.
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
            {backgroundColor: currentTheme.fadeColor},
          ]}>
          <View
            style={{
              backgroundColor: currentTheme.baseColor,
              position: 'absolute',
              paddingHorizontal: 4,
              paddingVertical: 1,
              borderRadius: 6,
              right: 10,
              top: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: currentTheme.contrastColor,
                textAlign: 'center',
                fontStyle: 'italic',
                fontSize: 12,
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
            <Text style={[styles.profileName, {color: currentTheme.baseColor}]}>
              {user?.name || 'Anonymous'}
            </Text>
            {user.email?.value && (
              <View style={styles.emailContainer}>
                <Text
                  ellipsizeMode="tail"
                  style={[styles.email, {color: currentTheme.baseColor}]}
                  numberOfLines={1}>
                  {`${user.email.value.slice(0, 3)}***@***.${
                    user.email.value.split('.')[
                      user.email.value.split('.').length - 1
                    ]
                  }`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <DrawerContentScrollView
        style={{flex: 1}}
        contentContainerStyle={{height: '85%'}}
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
          width: '90%',
          paddingHorizontal: 10,
          alignItems: 'center',
          alignSelf: 'center',
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
    paddingRight: 28,
  },
  innterContainer: {
    paddingHorizontal: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 15,
    height: 100,
  },
  profileImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 45,
    overflow: 'hidden',
  },
  profileImage: {
    height: '100%',
    width: 'auto',
  },
  profileNameContainer: {},
  profileName: {
    fontSize: 20,
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,
  },
  email: {
    fontSize: 14,
    textAlignVertical: 'center',
  },
});

export default MenuContent;
