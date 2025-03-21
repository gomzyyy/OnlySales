import {View} from 'react-native';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Header from '../../components/Header';
import {useTheme} from '../../hooks';
import QRCode from 'react-native-qrcode-svg';
import {useRoute} from '@react-navigation/native';
import {randomId} from '../../service/fn';
import {CurrencyType} from '../../../enums';
import {back} from '../../utils/nagivationUtils';

const PayByScan = () => {
  const {currentTheme} = useTheme();
  const {params} = useRoute();
  const {
    pa,
    pn,
    am,
    currency,
  } = params as {
    pa: string | undefined;
    pn: string | undefined;
    am: number | undefined;
    currency: CurrencyType | undefined;
  };
  useEffect(() => {
    if (!pa || !pn || !am || !currency) {
      back();
      return;
    }
  }, []);
  return (
    <View style={styles.parent}>
      <Header
        name="Scan & Pay"
        backButtom
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.contrastColor}
      />
      <View style={styles.container}>
        <QRCode
          value={`upi://pay?pa=${pa || 'gomzydhingra0001@okhdfc'}&pn=${
            pn || 'Khata App'
          }&mc=1234&tid=Txn${Date.now()}&tr=Order${randomId()}&tn=Payment%20for%20Udhar%20%26%20Pending%20Bills&am=${
            am || 0
          }&cu=${currency ?? CurrencyType.INR}`}
          size={200}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PayByScan;
