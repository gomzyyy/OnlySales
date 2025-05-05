import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type PDFViewerProps = {
  html: string;
};

const PDFPreViewer: React.FC<PDFViewerProps> = ({ html }) => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        showsVerticalScrollIndicator
        nestedScrollEnabled={true}
        textZoom={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});

export default PDFPreViewer;
