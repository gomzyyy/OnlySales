import {View, Text} from 'react-native';
import React, {useCallback, useEffect} from 'react';
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
  console.log(user);

  useFocusEffect(
    useCallback(() => {
      const initNavigation = async () => {
        prepareNavigation();
        if (!user) {
          setTimeout(() => resetAndNavigate('GetStarted'), 800);
        } else {
          const res = await validateTokenAPI({role: user.role});
          // console.log(res.data.user);
          if (res.success && res.data.user) {
            dispatch(setUser(res.data.user));
            resetAndNavigate('Dashboard');
          } else {
            setTimeout(() => resetAndNavigate('GetStarted'), 800);
          }
        }
      };
      initNavigation();
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
      </View>
    </View>
  );
};

export default SplashScreen;
