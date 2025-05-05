import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/Entypo';
import Icon5 from 'react-native-vector-icons/FontAwesome6';

import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

import {navigate} from '../../utils/nagivationUtils';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {navigationRef} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';

type menuNavContent = {
  name: string;
  navigateTo: string;
  icon: (color: string) => React.JSX.Element;
  disabled: boolean;
};

export const ManagementData: menuNavContent[] = [
  {
    name: 'Inventory',
    navigateTo: 'MyInventory',
    icon: (color: string) => <Icon4 name="shop" color={color} size={26} />,
    disabled: false,
  },
  {
    name: 'Customers',
    navigateTo: 'Customers',
    icon: (color: string) => (
      <Icon1 name="people-sharp" color={color} size={26} />
    ),
    disabled: false,
  },
  {
    name: 'Employees',
    navigateTo: 'Employees',
    icon: (color: string) => (
      <Icon3 name="network-wired" color={color} size={22} />
    ),
    disabled: false,
  },
];

export const ToolsData: menuNavContent[] = [
  {
    name: 'Analytics',
    navigateTo: 'Analytics',
    icon: (color: string) => <Icon2 name="analytics" color={color} size={26} />,
    disabled: false,
  },
  {
    name: 'Payments History',
    navigateTo: 'PaymentHistory',
    icon: (color: string) => (
      <Icon3 name="book" color={color} size={22} />
    ),
    disabled: false,
  },
  {
    name: 'Tools',
    navigateTo: 'BusinessTools',
    icon: (color: string) => <Icon4 name="tools" color={color} size={24} />,
    disabled: true,
  },
];

export const AppSettingsData: menuNavContent[] = [
  {
    name: 'Settings',
    navigateTo: 'Settings',
    icon: (color: string) => <Icon1 name="settings" color={color} size={26} />,
    disabled: false,
  },
  {
    name: 'My Profile',
    navigateTo: 'MyProfile',
    icon: (color: string) => <Icon3 name="user-tie" color={color} size={26} />,
    disabled: false,
  },
];

type MenuTabProps = {
  tabData: menuNavContent;
};

const MenuTab: React.FC<MenuTabProps> = ({tabData}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const currRoute = navigationRef.current?.getCurrentRoute()?.name;
  const navigation = useNavigation();
  const handleNavigationByMenu = (r: string): void => {
    if (currRoute === r) {
      navigation.dispatch(DrawerActions.closeDrawer());
      return;
    }
    navigate(r);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <TouchableOpacity
      style={[styles.navigationTab, {backgroundColor: currentTheme.baseColor}]}
      onPress={() => handleNavigationByMenu(tabData.navigateTo)}
      activeOpacity={0.8}
      disabled={tabData.disabled}>
      <Text style={[styles.tabText, {color: currentTheme.contrastColor}]}>
        {tabData.name || ''}
      </Text>

      {tabData.icon(currentTheme.contrastColor)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navigationTab: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    gap: 8,
  },
  tabText: {
    fontSize: 18,
  },
});

export default MenuTab;
