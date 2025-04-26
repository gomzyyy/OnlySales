import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';
import ReduxProvider from '../store/store';
import Navigation from './navigation/Navigation';
import BottomTabs from './components/BottomTabs';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';

const Index = () => {

  return (
    <I18nextProvider i18n={i18n}>
      <ReduxProvider>
        <View style={{flex: 1}}>
          <SafeAreaView style={{flex: 1}}>
            <StatusBar />
            {/* <Test /> */}
            <Navigation />
          </SafeAreaView>
        </View>
        <Toast position="bottom" visibilityTime={6000} />
        <BottomTabs />
      </ReduxProvider>
    </I18nextProvider>
  );
};

export default Index;
