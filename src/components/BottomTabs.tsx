import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceWidth} from '../utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../hooks/index';
import {navigate, navigationRef} from '../utils/nagivationUtils';

const bottomTabs = [
  {
    id: 0,
    name: 'Dashboard',
    navigateTo: 'Dashboard',
    icon: (color: string = '#000') => (
      <Icon color={color} name="data-saver-off" size={20} />
    ),
  },
  {
    id: 1,
    name: "Scan'n Pay",
    navigateTo: 'PayByScan',
    icon: (color: string = '#000') => (
      <Icon2 color={color} name="qr-code" size={20} />
    ),
  },
  {
    id: 2,
    name: 'Customers',
    navigateTo: 'Customers',
    icon: (color: string = '#000') => (
      <Icon2 color={color} name="people" size={20} />
    ),
  },
  {
    id: 3,
    name: 'Analytics',
    navigateTo: 'Analytics',
    icon: (color: string = '#000') => (
      <Icon color={color} name="analytics" size={20} />
    ),
  },
  {
    id: 4,
    name: 'Settings',
    navigateTo: 'Settings',
    icon: (color: string = '#000') => (
      <Icon2 color={color} name="settings-sharp" size={20} />
    ),
  },
];

const BottomTabs = () => {
  const {currentTheme} = useTheme();
  const [route, setRoute] = useState<string>(
    navigationRef.getCurrentRoute()?.name || '',
  );

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      setRoute(navigationRef.getCurrentRoute()?.name || '');
    });
    return unsubscribe;
  }, []);

  const handleNavigation = (navigateTo: string) => {
    if (route === navigateTo) return;
    navigate(navigateTo);
    return;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.bottomTabBg,
        },
      ]}>
      {bottomTabs.map(s => (
        <TouchableOpacity
          style={[
            styles.icon,
            {
              backgroundColor:
                route === s.navigateTo
                  ? currentTheme.baseColor
                  : currentTheme.contrastColor,
            },
          ]}
          key={s.id}
          onPress={() => handleNavigation(s.navigateTo)}>
          <View>
            {s.icon(
              route === s.navigateTo ? currentTheme.contrastColor : '#000',
            )}
          </View>
          <Text
            style={{
              color:
                route === s.navigateTo ? currentTheme.contrastColor : '#000',
            }}>
            {s.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    height: 60,
    width: deviceWidth * 0.95,
    flexDirection: 'row',
    marginHorizontal: 4,
    alignSelf: 'center',
    borderRadius: 14,
    padding: 4,
    // elevation:10,
    gap:4
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 2,
    elevation:10
  },
});

export default BottomTabs;
