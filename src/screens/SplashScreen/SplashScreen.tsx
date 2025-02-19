import {View, Text} from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <View style={{flex:1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>SplashScreen</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
