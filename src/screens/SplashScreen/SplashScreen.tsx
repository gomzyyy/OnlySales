import {View, Text, ActivityIndicator} from 'react-native';
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
import {RequestNotificationPermission} from '../../service/permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          if (res.success && res.data.user) {
            dispatch(setUser(res.data.user));
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
    const granted = await RequestNotificationPermission();
    console.log(granted);
    if (granted) {
      const token = await getFCMToken();
      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
        console.log(token);
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
    </View>
  );
};

export default SplashScreen;
