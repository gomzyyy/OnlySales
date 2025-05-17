import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {back} from '../../utils/nagivationUtils';
import Header from '../../components/Header';

type WebViewScreenProps = {};
type WebViewScreenParams = {
  url?: string;
};

const WebViewScreen: React.FC<WebViewScreenProps> = () => {
  // const {params} = useRoute();
  // const {url} = params as WebViewScreenParams;
  // useEffect(() => {
  //   if (!url) {
  //     back();
  //   }
  // }, [url, params]);
  return (
    <View style={{flex: 1}}>
      <Header backButton />
      <WebView
        source={{uri: 'http://192.168.1.71:3000/'}}
        style={{flex: 1}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        startInLoadingState
        allowsBackForwardNavigationGestures={true}
        onShouldStartLoadWithRequest={event => {
          console.log('Navigating to: ', event.url);
          return true; // allow all navigations inside WebView
        }}
      />
    </View>
  );
};

export default WebViewScreen;
