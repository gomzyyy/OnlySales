import {View, Text} from 'react-native';
import React from 'react';
import Header from '../../components/Header';

const SplashScreen = () => {
  return (
    <View style={{flex:1}}>
      <Header />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>SplashScreen</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
