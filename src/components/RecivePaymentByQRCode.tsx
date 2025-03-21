import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import {CurrencyType} from '../../enums';
import {Customer} from '../../types';
import {randomId} from '../service/fn';
import {deviceHeight} from '../utils/Constants';
import {useTheme} from '../hooks';

type RecivePaymentByQRCodeProps = {
  amount: number;
  pa: string;
  pn: string;
  currency: CurrencyType;
  //   customer: Customer;
  cancel: () => void;
  onPaid: () => void;
};

const RecivePaymentByQRCode: React.FC<RecivePaymentByQRCodeProps> = ({
  amount,
  pa,
  pn,
  currency,
  cancel,
  onPaid,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>Scan to Pay {`${currency} ${amount}`}</Text>
      <View style={styles.container}>
        <QRCode
          value={`upi://pay?pa=${pa}&pn=${pn}&mc=1234&tid=Txn${Date.now()}&tr=Order${randomId()}&tn=Payment%20for%20Udhar%20%26%20Pending%20Bills&am=${amount}&cu=${currency}`}
          size={220}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.45,
    paddingVertical: 20,
    gap: 26,
    borderRadius: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
export default RecivePaymentByQRCode;
