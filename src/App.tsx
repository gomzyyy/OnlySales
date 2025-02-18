import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

import ReduxProvider from '../store/store';
import Navigation from './navigation/Navigation';

function App(): React.JSX.Element {
  return (
    <ReduxProvider>
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar />
          <Navigation />
        </SafeAreaView>
      </View>
    </ReduxProvider>
  );
}

export default App;
