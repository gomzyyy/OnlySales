import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import WebView from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {back} from '../../utils/nagivationUtils';

type WebViewScreenProps = {};
type WebViewScreenParams = {
  url?: string;
};

const WebViewScreen: React.FC<WebViewScreenProps> = () => {
  const {params} = useRoute();
  const {url} = params as WebViewScreenParams;
  useEffect(() => {
    if (!url) {
      back();
    }
  }, [url, params]);
  return (
    <View style={{flex: 1}}>
      <WebView />
    </View>
  );
};

export default WebViewScreen;
