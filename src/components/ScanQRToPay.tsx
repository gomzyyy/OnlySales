import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../hooks';
import QRCode from 'react-native-qrcode-svg';
import {randomId} from '../service/fn';
import {CurrencyType} from '../../enums';
import {colors, deviceHeight} from '../utils/Constants';
import {SoldProduct} from '../../types';

type ScanQRToPay = {
  payableAmount?: number;
  cancel: () => void;
  currency: CurrencyType;
  callback: (soldProduct?:SoldProduct) => void;
  pa: string;
  pn: string;
  products?: SoldProduct[];
};

const ScanQRToPay: React.FC<ScanQRToPay> = ({
  payableAmount,
  callback,
  cancel,
  currency,
  pa,
  pn,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <View style={styles.container}>
        <QRCode
          value={`upi://pay?pa=${pa || 'gomzydhingra0001@okhdfcBank'}&pn=${
            pn || 'Khata App'
          }&mc=1234&tid=Txn${Date.now()}&tr=Order${randomId()}&tn=Payment%20for%20Udhar%20%26%20Pending%20Bills&am=${
            payableAmount || 0
          }&cu=${currency ?? CurrencyType.INR}`}
          size={200}
        />
      </View>
      <Text style={[styles.label]}>
        Please scan this QR code to Pay: {`${currency} ${payableAmount}`}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.dangerFade}]}
          onPress={cancel}>
          <Text style={[styles.buttonText, {color: colors.danger}]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: '#e6ffe6'}]}>
          <Text style={[styles.buttonText, {color: '#9ec378'}]}>
            Invoice
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.5,
    marginBottom: 10,
    borderRadius: 20,
    padding: 20,
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  button: {
    height: 60,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScanQRToPay;
