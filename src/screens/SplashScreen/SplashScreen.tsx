import {View, Text, ActivityIndicator, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppDispatch, RootState} from '../../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {prepareNavigation, resetAndNavigate} from '../../utils/nagivationUtils';
import {useFocusEffect} from '@react-navigation/native';
import {validateTokenAPI} from '../../api/api.auth';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {useTheme} from '../../hooks';
import {setUser} from '../../../store/slices/business';
import {getFCMToken} from '../../api/fcm/fn';
import {RequestUXPermission} from '../../service/permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUserLocationAPI} from '../../api/api.ucontrol';
import Geolocation from '@react-native-community/geolocation';
const COHERE_LOGO = require('../../assets/images/Cohere-Logo.png');

const SplashScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user);
  const {currentTheme} = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  useFocusEffect(
    useCallback(() => {
      const initNavigation = async () => {
        prepareNavigation();
        if (user && user._id) {
          const res = await validateTokenAPI({role: user.role}, setLoading);
          const {fine_location_permissions} = await RequestUXPermission();
          if (res.success && res.data.user) {
            dispatch(setUser(res.data.user));
            fine_location_permissions &&
              Geolocation.getCurrentPosition(
                async curr => {
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
                    await updateUserLocationAPI(locationData, setLoading);
                  }
                },
                error => {
                  console.error('Geolocation error:', error);
                  resetAndNavigate('Dashboard');
                },
              );
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
    }, [user]),
  );
  const getFireAppToken = async () => {
    const {notification_permissions} = await RequestUXPermission();
    if (notification_permissions) {
      const token = await getFCMToken();
      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
      }
    }
  };
  useEffect(() => {
    SystemNavigationBar.setNavigationColor(currentTheme.baseColor);
    getFireAppToken();
  }, []);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
          Welcome
        </Text>
        <View style={{marginTop: 40, height: 50}}>
          {loading && (
            <ActivityIndicator size={40} color={currentTheme.baseColor} />
          )}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          justifyContent: 'center',
          marginBottom: 4,
        }}>
        <Text style={{fontSize: 12, fontWeight: '900', fontStyle: 'italic'}}>
          Powered by
        </Text>
        <Image source={COHERE_LOGO} style={{height: 30, width: 60}} />
      </View>
    </View>
  );
};

export default SplashScreen;
