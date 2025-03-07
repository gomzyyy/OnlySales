import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {deviceHeight} from '../../../../utils/Constants';
import {
  navigate,
} from '../../../../utils/nagivationUtils';
import {useRoute} from '@react-navigation/native';
import {Shopkeeper} from '../../../../../types';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {login} from '../../../../../store/slices/shopkeeper';

type UserFoundParams = {
  user: Shopkeeper;
};
const UserFound = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {params} = useRoute();
  const {user} = params as UserFoundParams;

  useEffect(() => {
    const timeoutId: NodeJS.Timeout = setTimeout(() => {
      dispatch(login({userId: user.userId}));
      navigate('Dashboard');
    }, 900);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>Hello {`${user.name}, `}Welcome Back!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: deviceHeight * 0.2,
  },
});

export default UserFound;
