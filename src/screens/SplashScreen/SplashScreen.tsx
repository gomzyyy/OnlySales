import {View, Text, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {AppDispatch, RootState} from '../../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  navigate,
  prepareNavigation,
  resetAndNavigate,
} from '../../utils/nagivationUtils';
import {useFocusEffect} from '@react-navigation/native';
import {validateTokenAPI} from '../../api/api.auth';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {useTheme} from '../../hooks';
import {setUser} from '../../../store/slices/business';

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
  useEffect(() => {
    SystemNavigationBar.setNavigationColor(currentTheme.baseColor);
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
