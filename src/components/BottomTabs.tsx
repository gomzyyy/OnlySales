import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceWidth} from '../utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
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
    icon: (color: string = '#000', size: number = 20) => (
      <Icon color={color} name="data-saver-off" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
  {
    id: 2,
    name: 'Customers',
    navigateTo: 'Customers',
    icon: (color: string = '#000', size: number = 20) => (
      <Icon2 color={color} name="people" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
  {
    id: 3,
    name: 'Analytics',
    navigateTo: 'Analytics',
    icon: (color: string = '#000', size: number = 20) => (
      <Icon color={color} name="analytics" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
  {
    id: 4,
    name: 'Employees',
    navigateTo: 'Employees',
    icon: (color: string = '#000', size: number = 20) => (
      <Icon color={color} name="work" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
  {
    id: 5,
    name: 'Settings',
    navigateTo: undefined,
    icon: (color: string = '#000', size: number = 20) => (
      <Icon3 color={color} name="dots-horizontal-circle-outline" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
];

const BottomTabs = () => {
  const {currentTheme} = useTheme();
  const {lightTap} = useHaptics();
  const [route, setRoute] = useState<string>('');
  const [openMoreMenu, setOpenMoreMenu] = useState<boolean>(false);
  const bottomTabsY = useSharedValue(100);

  const bottomTabsAnimations = useAnimatedStyle(() => ({
    transform: [{translateY: bottomTabsY.value}],
  }));

  useEffect(() => {
    let unsubscribe;
    openMoreMenu && setOpenMoreMenu(false);
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
          setOpenMoreMenu(false);
          bottomTabsY.value = withTiming(100, {duration: 400});
        } else if (validRoutes.includes(current)) {
          bottomTabsY.value = withTiming(-5, {duration: 500});
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

  const MoreContainer = () => {
    const moreOptions = [
      {
        id: 0,
        name: 'My Profile',
        navigateTo: 'MyProfile',
        icon: (color: string = '#000', size: number = 16) => (
          <Icon4 color={color} name="user-tie" size={size} />
        ),
        onPress: (cb?: () => void) => cb && cb(),
      },
      {
        id: 1,
        name: 'Settings',
        navigateTo: 'Settings',
        icon: (color: string = '#000', size: number = 16) => (
          <Icon2 color={color} name="settings" size={size} />
        ),
        onPress: (cb?: () => void) => cb && cb(),
      },
    ];
const moreContainerY = useSharedValue(-100);
const moreContainerAnimatedStyles = useAnimatedStyle(()=>({

}))
    return (
      <View
        style={[
          {
            width: 140,
            position: 'absolute',
            bottom: 70,
            right: 10,
            elevation: 10,
            borderRadius: 6,
            backgroundColor: currentTheme.contrastColor,
            overflow: 'hidden',
            paddingHorizontal: 10,
          },
        ]}>
        <Animated.View>
          {moreOptions.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={{
                borderBottomColor: '#ababab',
                borderBottomWidth: i === moreOptions.length - 1 ? 0 : 1,
                height: 30,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 6,
                paddingLeft: 10,
              }}
              onPress={() => {
                setOpenMoreMenu(false);
                s.navigateTo
                  ? handleNavigation(s.navigateTo)
                  : s.onPress(
                      () => s.name === 'More' && setOpenMoreMenu(!openMoreMenu),
                    );
              }}>
              <View style={{flex: 1}}>{s.icon()}</View>
              <Text style={{flex: 3, fontWeight: '600'}}>
                {s.name.toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={{position: 'relative'}}>
      {openMoreMenu && <MoreContainer />}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)',
            padding: 2,
            borderRadius: 16,
          },
          bottomTabsAnimations,
        ]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: currentTheme.contrastColor,
            },
          ]}>
          {bottomTabs.map(s => (
            <Pressable
              style={[
                styles.icon,
                {
                  backgroundColor:
                    route === s.navigateTo
                      ? currentTheme.baseColor
                      : currentTheme.contrastColor,
                  borderRadius: 12,
                },
              ]}
              key={s.id}
              onPress={() => {
                openMoreMenu && setOpenMoreMenu(false);
                s.navigateTo
                  ? handleNavigation(s.navigateTo)
                  : s.onPress(
                      () => s.name === 'More' && setOpenMoreMenu(!openMoreMenu),
                    );
              }}>
              <View>
                {s.icon(
                  route === s.navigateTo ? currentTheme.contrastColor : '#000',
                )}
              </View>
              <Text
                style={{
                  color:
                    route === s.navigateTo
                      ? currentTheme.contrastColor
                      : '#000',
                  fontSize: 10,
                }}>
                {s.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: deviceWidth * 0.96,
    maxWidth: 460,
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    elevation: 10,
    gap: 4,
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
});

export default BottomTabs;
