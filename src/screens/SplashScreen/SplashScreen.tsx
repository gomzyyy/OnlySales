import {View, Text} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {RootState} from '../../../store/store';
import {useSelector} from 'react-redux';
import {
  navigate,
  prepareNavigation,
  resetAndNavigate,
} from '../../utils/nagivationUtils';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {useTheme} from '../../hooks';

const SplashScreen = () => {
  const owner = useSelector((s: RootState) => s.appData.BusinessOwner);
  const app = useSelector((s: RootState) => s.appData.app);

  const {currentTheme} = useTheme();

  useFocusEffect(
    useCallback(() => {
      const initNavigation = async () => {
        prepareNavigation();
        if (!owner?.sessionId) {
          setTimeout(() => resetAndNavigate('GetStarted'), 800);
        } else {
          if (app.appLocked && owner.accessPasscode) {
            setTimeout(
              () => navigate('Unlock', {user: owner, logged: true}),
              800,
            );
            return;
          }
          setTimeout(() => resetAndNavigate('Dashboard'), 800);
        }
      };
      initNavigation();
    }, [owner]),
  );
  const getValueableData = async () => {
    try {
      const res = await fetch('http://192.168.1.71:6900/api/app/login');
      if (!res.ok) throw new Error('Unable to fetch at the moment.');
      const jsonRes = await res.json();
      await Promise.all([
        AsyncStorage.setItem('pa', jsonRes.pa),
        AsyncStorage.setItem('pn', jsonRes.pn),
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getValueableData();
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
      </View>
    </View>
  );
};

export default SplashScreen;
