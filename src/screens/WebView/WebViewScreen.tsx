import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import ExpandButton from './components/ExpandButton';
import {back} from '../../utils/nagivationUtils';
import {NATIVE_WEBVIEW_MESSAGE_TYPE} from '../../../enums';
import {useStorage} from '../../hooks';

type WebViewScreenProps = {};
type WebViewScreenParams = {
  uri?: string;
};

const WebViewScreen: React.FC<WebViewScreenProps> = () => {
  const {params} = useRoute();
  const {local} = useStorage();
  const paramUrl = (params as WebViewScreenParams)?.uri || 'www.google.com';
  const [url, setUrl] = useState<string>(paramUrl);
  const [inputActivated, setInputActivated] = useState<boolean>(false);

  const WebViewEventHandler = (event: WebViewMessageEvent) => {
    if (
      event.nativeEvent.data ===
      NATIVE_WEBVIEW_MESSAGE_TYPE.OWNER_PROFILE_UPDATE_SUCCESS
    ) {
      local.updateUser().then(e => back()).catch(()=>{})
    }
  };
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <ExpandButton
        onBackBtnPress={() => back()}
        onSearchBtnPress={() => setInputActivated(!inputActivated)}
      />
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        startInLoadingState
        allowsBackForwardNavigationGestures={true}
        onShouldStartLoadWithRequest={event => {
          console.log('Navigating to: ', event.url);
          return true;
        }}
        onMessage={e => WebViewEventHandler(e)}
      />
    </View>
  );
};

export default WebViewScreen;
