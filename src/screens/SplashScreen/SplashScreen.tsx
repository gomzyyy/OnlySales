import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {RootState} from '../../../store/store';
import {useSelector} from 'react-redux';
import {
  navigate,
  prepareNavigation,
  resetAndNavigate,
} from '../../utils/nagivationUtils';

const SplashScreen = () => {
  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);
  const app = useSelector((s: RootState) => s.shopkeeper.app);

  useEffect(() => {
    const initNavigation = async () => {
      prepareNavigation();
      if (!shopkeeper?.sessionId) {
        setTimeout(() => resetAndNavigate('GetStarted'), 800);
      } else {
        if (app.appLocked) {
          setTimeout(
            () => navigate('Unlock', {user: shopkeeper, logged: true}),
            800,
          );
          return;
        }
        setTimeout(() => resetAndNavigate('Dashboard'), 800);
      }
    };

    initNavigation();
  }, [shopkeeper]);
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
