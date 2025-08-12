import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Image, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppDispatch, RootState} from '../../../store/store';
import {prepareNavigation, resetAndNavigate} from '../../utils/nagivationUtils';
import {useStorage, useTheme} from '../../hooks';
import {setLockedState, setUser} from '../../../store/slices/business';
import {getFCMToken} from '../../api/fcm/fn';
import {RequestUXPermission} from '../../service/permissions';
import {updateUserLocationAPI} from '../../api/api.ucontrol';
import LinearGradient from 'react-native-linear-gradient';
const COHERE_LOGO = require('../../assets/images/Cohere-Logo.png');
const ONLYSALES_LOGO = require('../../assets/images/ONLYSALES_LOGO.png');

type SplashScreenParams = {
  locked?: boolean;
};

const SplashScreen = () => {
  const {local} = useStorage();
  const route = useRoute();
  const {locked = true} = (route.params || {}) as SplashScreenParams;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user);
  const {appLocked} = useSelector((s: RootState) => s.appData.app);
  const {currentTheme} = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const initNavigation = async () => {
        prepareNavigation();
        if (user && user._id) {
          const res = await local.updateUser();
          if (res.success && res.data && res.data.user) {
            if (
              res.data.user.isLocked &&
              res.data.user.accessPasscode &&
              res.data.user.accessPasscode.trim().length > 0 &&
              locked !== false
            ) {
              dispatch(setLockedState(true));
              resetAndNavigate('Unlock');
              return;
            }
            const {fine_location_permissions} = await RequestUXPermission();
            if (fine_location_permissions) {
              Geolocation.getCurrentPosition(async curr => {
                const latitude = curr.coords.latitude;
                const longitude = curr.coords.longitude;
                if (res.data.user) {
                  const locationData = {
                    query: {role: res.data.user.role},
                    body: {
                      periodicLatitude: latitude,
                      periodicLongitude: longitude,
                    },
                  };
                 const g = await updateUserLocationAPI(locationData, setLoading);
                 console.log(g)
                }
              });
            }
            resetAndNavigate('Dashboard');
          } else {
            resetAndNavigate('GetStarted');
          }
        } else {
          resetAndNavigate('GetStarted');
        }
      };

      const timeoutId = setTimeout(() => initNavigation(), 800);
      return () => {
        clearTimeout(timeoutId);
      };
    }, [user, appLocked, locked, dispatch, local]),
  );

  const getFireAppToken = async () => {
    const {notification_permissions} = await RequestUXPermission();
    if (notification_permissions) {
      const token = await getFCMToken();
      if (token) {
        console.log(token);
        await AsyncStorage.setItem('fcmtoken', token);
      }
    }
  };

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(currentTheme.baseColor);
    getFireAppToken();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: currentTheme.bgColor}]}>
      <View style={styles.centerContent}>
        <LinearGradient
          colors={['rgba(138, 43, 226, 0.2)', 'rgba(0, 207, 255, 0.2)']}
          start={{x: 0, y: 0}}
          style={{paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10}}>
          <Image source={ONLYSALES_LOGO} style={{width: 180, height: 40}} />
          <Text style={[styles.subheading, {color: currentTheme.textAlt}]}>
            Empowering Local businesses.
          </Text>
        </LinearGradient>

        <View style={styles.loaderContainer}>
          {loading && (
            <ActivityIndicator size={40} color={currentTheme.baseColor} />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.poweredBy, {color: currentTheme.textAlt}]}>
          Powered by
        </Text>
        <Image source={COHERE_LOGO} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 8,
    marginTop: 6,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  loaderContainer: {
    marginTop: 40,
    height: 50,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  poweredBy: {
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  logo: {
    height: 30,
    width: 60,
  },
});

export default SplashScreen;
