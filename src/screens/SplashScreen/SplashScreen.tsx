import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import { AppDispatch, RootState } from '../../../store/store';
import { prepareNavigation, resetAndNavigate } from '../../utils/nagivationUtils';
import { useStorage, useTheme } from '../../hooks';
import { setLockedState } from '../../../store/slices/business';
import { getFCMToken } from '../../api/fcm/fn';
import { RequestUXPermission } from '../../service/permissions';
import { updateUserLocationAPI } from '../../api/api.ucontrol';

const COHERE_LOGO = require('../../assets/images/Cohere-Logo.png');
const ONLYSALES_LOGO = require('../../assets/images/ONLYSALES_LOGO.png');

type SplashScreenParams = {
  locked?: boolean;
};

const SplashScreen = () => {
  const { local } = useStorage();
  const route = useRoute();
  const { locked = true } = (route.params || {}) as SplashScreenParams;
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((s: RootState) => s.appData.user);
  const { appLocked } = useSelector((s: RootState) => s.appData.app);

  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Initialize App Flow
   */
  const initNavigation = async () => {
    try {
      prepareNavigation();

      if (user && user._id) {
        const res = await local.updateUser();

        if (res.success && res.data?.user) {
          const updatedUser = res.data.user;

          // Check lock state
          if (
            updatedUser.isLocked &&
            updatedUser.accessPasscode?.trim().length > 0 &&
            locked !== false
          ) {
            dispatch(setLockedState(true));
            return resetAndNavigate('Unlock');
          }

          // Request location permissions
          const { fine_location_permissions } = await RequestUXPermission();
          if (fine_location_permissions) {
            Geolocation.getCurrentPosition(async curr => {
              try {
                const { latitude, longitude } = curr.coords;
                const locationData = {
                  query: { role: updatedUser.role },
                  body: { periodicLatitude: latitude, periodicLongitude: longitude },
                };
                await updateUserLocationAPI(locationData, setLoading);
              } catch (err) {
                console.warn('Location update failed:', err);
              }
            });
          }

          return resetAndNavigate('Dashboard');
        }
      }

      // If no valid user, go to GetStarted
      resetAndNavigate('GetStarted');
    } catch (err) {
      console.error('Init navigation failed:', err);
      resetAndNavigate('GetStarted');
    }
  };

  /**
   * Setup auto-navigation with timeout fallback (10s max)
   */
  useFocusEffect(
    useCallback(() => {
      let timeoutId: NodeJS.Timeout;

      const startFlow = async () => {
        timeoutId = setTimeout(() => {
          console.warn('User sync timeout → redirecting to GetStarted');
          resetAndNavigate('GetStarted');
        }, 10000); // 10 seconds

        await initNavigation();
        clearTimeout(timeoutId);
      };

      const delayId = setTimeout(startFlow, 800); // little splash delay

      return () => {
        clearTimeout(delayId);
        clearTimeout(timeoutId);
      };
    }, [user, appLocked, locked, dispatch, local])
  );

  /**
   * Get FCM token
   */
  const getFireAppToken = async () => {
    try {
      const { notification_permissions } = await RequestUXPermission();
      if (notification_permissions) {
        const token = await getFCMToken();
        if (token) {
          await AsyncStorage.setItem('fcmtoken', token);
          console.log('FCM Token:', token);
        }
      }
    } catch (err) {
      console.warn('Fetching FCM token failed:', err);
    }
  };

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(currentTheme.contrastColor);
    getFireAppToken();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bgColor }]}>
      <View style={styles.centerContent}>
        <LinearGradient
          colors={['rgba(138, 43, 226, 0.2)', 'rgba(0, 207, 255, 0.2)']}
          start={{ x: 0, y: 0 }}
          style={styles.brandWrapper}>
          <Image source={ONLYSALES_LOGO} style={styles.logoMain} />
          <Text style={[styles.subheading, { color: currentTheme.textAlt }]}>
            Empowering Local businesses.
          </Text>
        </LinearGradient>

        <View style={styles.loaderContainer}>
          {loading && <ActivityIndicator size={40} color={currentTheme.baseColor} />}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.poweredBy, { color: currentTheme.textAlt }]}>Powered by</Text>
        <Image source={COHERE_LOGO} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingVertical: 40, paddingHorizontal: 20 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brandWrapper: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  logoMain: { width: 180, height: 40 },
  subheading: { fontSize: 8, marginTop: 6, textAlign: 'right', textDecorationLine: 'underline' },
  loaderContainer: { marginTop: 40, height: 50, justifyContent: 'center' },
  footer: { alignItems: 'center', gap: 6, flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  poweredBy: { fontSize: 12, fontWeight: '900', fontStyle: 'italic' },
  logo: { height: 30, width: 60 },
});

export default SplashScreen;
