import {View, StyleSheet, Button} from 'react-native';
import React, {useState} from 'react';
import {AIResponseLengthType} from '../../../enums';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAnalytics, useTheme} from '../../hooks';
import d from 'react-native-device-info';

import {analyseBusinessAIAPI} from '../../api/api.ai';

const Test = () => {
  const {currentTheme} = useTheme();  const {owner} = useAnalytics();
  const getDeviceInfo = async () => {
    console.log(d.getDeviceNameSync());
  };
  //     const req = async()=>{
  //       const data={
  //         query:{
  // oid:owner._id,
  // role:user.role,
  // rl:AIResponseLengthType.sm
  //         }
  //       }
  //       const res = await analyseBusinessAIAPI(data);
  //       console.log(res)
  //     }

  return (
    <SafeAreaView
      style={[styles.screen, {backgroundColor: currentTheme.contrastColor}]}>
      {/* <WebViewScreen /> */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Button title="REQ" onPress={getDeviceInfo} />
      </View>
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
