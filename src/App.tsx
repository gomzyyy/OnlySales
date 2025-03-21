import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import ReduxProvider from '../store/store';
import Navigation from './navigation/Navigation';
import DeviceInfo from 'react-native-device-info';

const DeviceId = DeviceInfo.getAndroidId();
console.log(DeviceId);

function App(): React.JSX.Element {
  return (
    <ReduxProvider>
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar />
          <Navigation />
        </SafeAreaView>
      </View>
      <Toast position="bottom" visibilityTime={6000} />
    </ReduxProvider>
  );
}

export default App;
