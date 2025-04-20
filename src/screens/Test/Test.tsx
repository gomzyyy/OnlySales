import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import RecivePaymentByQRCode from '../../components/RecivePaymentByQRCode';
import {CurrencyType} from '../../../enums';
import SlideUpContainer from '../../components/SlideUpContainer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';

const value = `upi://pay?pa=gomzydhingra0001@okhdfcbank&pn=GomzyDev&mc=1234&tid=Txn7367289298&tr=Order1236&tn=Payment%20for%20Udhar%20%26%20Pending%20Bills&am=50&cu=INR`;

const Test = () => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const user = useSelector((s: RootState) => s.appData.user);
  console.log(user);
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        <Button title="PAY" onPress={() => setOpen(true)} />
        <SlideUpContainer
          open={open}
          opacity={0.2}
          close={() => setOpen(false)}>
          <RecivePaymentByQRCode
            pa="gomzydhingra0001@okhdfcbank"
            pn="Gomzy Dhingra"
            amount={200}
            cancel={() => {}}
            onPaid={() => {}}
            currency={CurrencyType.INR}
          />
        </SlideUpContainer>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    gap: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  successText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default Test;
