import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceWidth} from '../utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useHaptics, useTheme} from '../hooks/index';
import {
  navigate,
  navigationRef,
  prepareNavigation,
} from '../utils/nagivationUtils';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const validRoutes = ['Dashboard', 'Analytics', 'Customers', 'Employees'];

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
  const {lightTap} = useHaptics();
  const [route, setRoute] = useState<string>('');

  const bottomTabsY = useSharedValue(100);

  const bottomTabsAnimations = useAnimatedStyle(() => ({
    transform: [{translateY: bottomTabsY.value}],
  }));

  useEffect(() => {
    let unsubscribe;

    if (prepareNavigation()) {
      unsubscribe = navigationRef.addListener('state', () => {
        const current = navigationRef.getCurrentRoute()?.name || '';
        setRoute(current);

        const rootState = navigationRef.getRootState();
        const drawerRoute: any = rootState.history?.find(
          (s: any) => s.type === 'drawer',
        );
        let isDrawerOpen: boolean | undefined;
        if (drawerRoute) {
          isDrawerOpen = drawerRoute.status === 'open';
        }
        if (isDrawerOpen !== undefined && isDrawerOpen === true) {
          bottomTabsY.value = withTiming(100, {duration: 400});
        } else if (validRoutes.includes(current)) {
          bottomTabsY.value = withTiming(-10, {duration: 500});
        } else {
          bottomTabsY.value = withTiming(100, {duration: 200});
        }
      });
    }

    return unsubscribe;
  }, [route]);

  const handleNavigation = (navigateTo: string) => {
    if (route === navigateTo) return;
    navigate(navigateTo);
    lightTap();
    return;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.contrastColor,
        },
        bottomTabsAnimations,
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, // This allows the translateY to handle position
    height: 60,
    width: deviceWidth * 0.95,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 14,
    padding: 4,
    elevation: 10,
    gap: 4,
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 2,
  },
});

export default BottomTabs;
