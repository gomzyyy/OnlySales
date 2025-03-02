import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import ReduxProvider from '../store/store';
import Navigation from './navigation/Navigation';

function App(): React.JSX.Element {
  return (
    <ReduxProvider>
      <View style={{flex: 1}}>
          <SafeAreaView style={{flex: 1}}>
            <StatusBar />
            <Navigation />
            {/* <BottomTabs /> */}
          </SafeAreaView>
      </View>
      <Toast position="bottom" visibilityTime={6000} />
    </ReduxProvider>
  );
}

export default App;
