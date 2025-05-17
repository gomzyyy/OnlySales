import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
  Button,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import RecivePaymentByQRCode from '../../components/RecivePaymentByQRCode';
import {CurrencyType} from '../../../enums';
import SlideUpContainer from '../../components/SlideUpContainer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {deviceHeight, deviceWidth} from '../../utils/Constants';
import GeoLocation from '@react-native-community/geolocation';
import Pdf from 'react-native-pdf';
import Header from '../../components/Header';
import ReactNaviveHTMLToPdf, {Options} from 'react-native-html-to-pdf';
import WebView from 'react-native-webview';
import {KEYWORDS, RESERVED_KEYWORDS} from '../../utils/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks';
import {colors} from '../../utils/Constants';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {back} from '../../utils/nagivationUtils';
import WebViewScreen from '../WebView/WebViewScreen';
// const value = `upi://pay?pa=gomzydhingra0001@okhdfcbank&pn=GomzyDev&mc=1234&tid=Txn7367289298&tr=Order1236&tn=Payment%20for%20Udhar%20%26%20Pending%20Bills&am=50&cu=INR`;

const Test = () => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  // const user = useSelector((s: RootState) => s.appData.user);
  const {currentTheme} = useTheme();
  // GeoLocation.getCurrentPosition(success => console.log(success));

  const generatePdf = async () => {
    const options: Options = {
      html: `<h1>Hello, I hope youre fine.</h1>`,
      fileName: `Hello`,
      directory: `invoices`,
    };
    // const res = await ReactNaviveHTMLToPdf.convert(options);
    // console.log(res);
  };
  const path =
    '/storage/emulated/0/Android/data/com.khata/files/invoices/Hello.pdf';

  return (
    <SafeAreaView
      style={[styles.screen, {backgroundColor: currentTheme.contrastColor}]}>
      <WebViewScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    marginBottom: 10,
  },
  customNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  block: {
    marginBottom: 25,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  category: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  methodBlock: {
    marginLeft: 10,
    marginTop: 8,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodDesc: {
    fontSize: 13,
    marginLeft: 10,
  },
  reservedItem: {
    fontSize: 16,
    marginTop: 4,
  },
});
// const styles = StyleSheet.create({
//   parent: {
//     flex: 1,
//     // justifyContent: 'center',
//   },
//   container: {
//     gap: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 100,
//     paddingTop: 100,
//     flex: 1,
//   },
//   successText: {
//     textAlign: 'center',
//     fontSize: 26,
//     fontWeight: 'bold',
//   },
// });

{
  /* <View style={styles.container}> */
}

{
  /* </View> */
}

export default Test;

{
  /* <View style={styles.parent}>
<View style={{height:60,}}>
  <TextInput />
</View>
<WebView source={{uri: 'www.google.com'}} />
</View> */
}

{
  /* <Pdf trustAllCerts={false} enablePaging horizontal style={{flex:1,width:deviceWidth,backgroundColor:'#dbdbdb'}} source={{uri:`https://api.printnode.com/static/test/pdf/multipage.pdf`}} /> */
}
{
  /* <Header backButton name="Test" /> */
}
{
  /* <View style={styles.container}>
        <Button title="Generate PDF" onPress={generatePdf} />
        <Pdf
          trustAllCerts={false}
          enablePaging
          horizontal
          style={{flex: 1, width: deviceWidth, backgroundColor: '#dbdbdb'}}
          source={{uri: `file://${path}`}}
        />
      </View> */
}

{
  /* <Button title="PAY" onPress={() => setOpen(true)} />
<SlideUpContainer
  open={open}
  opacity={0.2}
  close={() => setOpen(false)}
  height={deviceHeight * 0.45}
  >
  <RecivePaymentByQRCode
    pa="gomzydhingra0001@okhdfcbank"
    pn="Gomzy Dhingra"
    amount={200}
    cancel={() => {}}
    onPaid={() => {}}
    currency={CurrencyType.INR}
  />
</SlideUpContainer> */
}
