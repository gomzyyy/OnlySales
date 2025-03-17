import {View, Text} from 'react-native';
import React, {useCallback} from 'react';
import {RootState} from '../../../store/store';
import {useSelector} from 'react-redux';
import {
  navigate,
  prepareNavigation,
  resetAndNavigate,
} from '../../utils/nagivationUtils';
import {useFocusEffect} from '@react-navigation/native';

const SplashScreen = () => {
  const owner = useSelector((s: RootState) => s.appData.BusinessOwner);
  const app = useSelector((s: RootState) => s.appData.app);

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
