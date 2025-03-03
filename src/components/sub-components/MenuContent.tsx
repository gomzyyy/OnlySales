import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Icon1 from 'react-native-vector-icons/Ionicons';
import {navigate} from '../../utils/nagivationUtils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {navigationRef} from '../../utils/nagivationUtils';
const NoProfile = require('../../assets/images/no-profile.jpg');
import useTheme from '../../hooks/useTheme';

type menuNavContent = {
  name: string;
  navigateTo: string;
  icon: (color: string) => React.JSX.Element;
};

const menuNav: menuNavContent[] = [
  {
    name: 'Dashboard',
    navigateTo: 'Dashboard',
    icon: (color: string) => (
      <Icon1 name="people-sharp" color={color} size={26} />
    ),
  },
  {
    name: 'Settings',
    navigateTo: 'Settings',
    icon: (color: string) => <Icon1 name="settings" color={color} size={26} />,
  },
  {
    name: 'Menu',
    navigateTo: 'MyMenu',
    icon: (color: string) => <Icon1 name="fast-food" color={color} size={26} />,
  },
];

const MenuContent: React.FC<DrawerContentComponentProps> = (
  props,
): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const currRoute = navigationRef.current?.getCurrentRoute()?.name;
  const navigation = useNavigation();
  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);
  const handleNavigationByMenu = (r: string): void => {
    if (currRoute === r) {
      navigation.dispatch(DrawerActions.closeDrawer());
      return;
    }
    navigate(r);
    navigation.dispatch(DrawerActions.closeDrawer());
  };
  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <DrawerContentScrollView style={{flex: 1}} nestedScrollEnabled {...props}>
        <View style={styles.innterContainer}>
          <View
            style={[
              styles.infoContainer,
              {backgroundColor: currentTheme.baseColor},
            ]}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  shopkeeper.image && shopkeeper.image?.trim().length !== 0
                    ? {uri: shopkeeper.image}
                    : NoProfile
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileNameContainer}>
              <Text
                style={[
                  styles.profileName,
                  {color: currentTheme.contrastColor},
                ]}>
                {shopkeeper.name}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.navigtionTabContainer}>
          {menuNav.map((m, i) => (
            <TouchableOpacity
              style={[
                styles.navigationTab,
                {backgroundColor: currentTheme.fadeColor},
              ]}
              key={i}
              onPress={() => handleNavigationByMenu(m.navigateTo)}
              activeOpacity={0.8}>
              {m.icon(currentTheme.contrastColor)}
              <Text
                style={[styles.tabText, {color: currentTheme.contrastColor}]}>
                {m.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 5,
  },
  innterContainer: {},
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  profileImageContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
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
    gap: 8,
    paddingRight: 20,
  },
  navigationTab: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 20,
  },
});

export default MenuContent;
