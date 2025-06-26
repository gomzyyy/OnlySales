import {Text, TouchableOpacity, View, TextInput, Image} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../hooks';
import QRCode from 'react-native-qrcode-svg';
import {randomId} from '../service/fn';
import {CurrencyType} from '../../enums';
import {colors, deviceHeight} from '../utils/Constants';
import {SoldProduct} from '../../types';
import {global} from '../styles/global';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {setPymtId} from '../../store/slices/business';
import SlideUpContainer from './SlideUpContainer';
const UPI_LOGO = require('../assets/images/UPI_LOGO.png');

type ScanQRToPay = {
  payableAmount?: number;
  cancel: () => void;
  currency: CurrencyType;
  callback: () => void;
  products?: SoldProduct[];
};

const ScanQRToPay: React.FC<ScanQRToPay> = ({
  payableAmount,
  callback,
  cancel,
  currency,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const d = useDispatch<AppDispatch>();
  const {upi_id, visible_message, visible_name} = useSelector(
    (s: RootState) => s.appData.app.lc_meta_data,
  );
  const [changeUpi, setChangeUpi] = useState<boolean>(false);
  const [confirmPaymentSuccess, setConfirmPaymentSuccess] =
    useState<boolean>(false);
  const [upiid, setUpiid] = useState<string>(upi_id.id);
  const handleEditUpiid = () => {
    if (upiid.trim().length > 0) {
      d(setPymtId(upiid));
    }
    setChangeUpi(false);
  };
  useEffect(() => {
    setUpiid(upi_id.id);
  }, [upi_id]);
  const cancelChangeUpi = () => {
    if (upi_id.id.trim().length === 0) {
      cancel();
    }
    setChangeUpi(false);
  };
  const copyUPIid = () => Clipboard.setString(upi_id.id);
  const handleInvoicePress = () => setConfirmPaymentSuccess(true);
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      {!changeUpi && upi_id.id.trim().length !== 0 ? (
        <>
          <View style={styles.container}>
            <QRCode
              value={`upi://pay?pa=${
                upi_id.id.length > 0 ? upi_id.id : 'gomzydhingra0001@okhdfcBank'
              }&pn=${
                visible_name || 'Khata App'
              }&mc=1234&tid=Txn${Date.now()}&tr=Order${randomId()}&tn=${encodeURIComponent(
                visible_message || 'Thanks for puschase.',
              )}&am=${payableAmount || 0}&cu=${currency ?? CurrencyType.INR}`}
              size={200}
            />
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', gap: 4, marginVertical: 6}}>
                <Image source={UPI_LOGO} style={{height: 20, width: 40}} />
                <TouchableOpacity activeOpacity={0.8} onPress={copyUPIid}>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: 14,
                      fontStyle: 'italic',
                    }}>
                    {upi_id.id}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.changeIDButton}
                onPress={() => setChangeUpi(true)}>
                <Text
                  style={{color: '#fff', fontSize: 16, textAlign: 'center'}}>
                  Change UPI?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.label]}>
            Please scan this QR code to Pay: {`${currency} ${payableAmount}`}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.dangerFade}]}
              onPress={cancel}>
              <Text style={[styles.buttonText, {color: colors.danger}]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.oliveGreenFade}]}
              onPress={handleInvoicePress}>
              <Text style={[styles.buttonText, {color: colors.oliveGreen}]}>
                Invoice
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.changeidContainer}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 20,
              }}>
              {upi_id.id.trim().length === 0 ? 'Set UPI ID' : 'Change UPI'}
            </Text>
            <TextInput
              value={upiid}
              onChangeText={setUpiid}
              style={[global.inputText, {fontSize: 14, textAlign: 'center'}]}
              placeholder="UPI id here"
              placeholderTextColor={'#ababab'}
              cursorColor={'rgba(0,0,0,0)'}
            />
            <View style={{flex: 1, marginTop: 10}}>
              <Text style={[styles.textItem, {color: currentTheme.textColor}]}>
                {`\u2022 `}
                <Text style={styles.textContent}>
                  This ID will be securely stored locally in your device.
                </Text>
              </Text>
              <Text style={[styles.textItem, {color: currentTheme.textColor}]}>
                {`\u2022 `}
                <Text style={styles.textContent}>
                  Your UPI ID is never shared with third parties without your
                  consent.
                </Text>
              </Text>
              <Text style={[styles.textItem, {color: currentTheme.textColor}]}>
                {`\u2022 `}
                <Text style={styles.textContent}>
                  We encrypt your data with strong security measures.
                </Text>
              </Text>
              <Text style={[styles.textItem, {color: currentTheme.textColor}]}>
                {`\u2022 `}
                <Text style={styles.textContent}>
                  You can later change or remove your ID from settings.
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.dangerFade}]}
              onPress={cancelChangeUpi}>
              <Text style={[styles.buttonText, {color: colors.danger}]}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#e6ffe6'}]}
              onPress={handleEditUpiid}>
              <Text style={[styles.buttonText, {color: '#9ec378'}]}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <SlideUpContainer
        open={confirmPaymentSuccess}
        close={() => setConfirmPaymentSuccess(false)}
        height={150}>
        <View
          style={{
            backgroundColor: currentTheme.contrastColor,
            height: 150,
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 10,
            borderRadius: 20,
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 22, fontWeight: '600', textAlign: 'center'}}>
            Payment recieved?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.dangerFade}]}
              onPress={() => setConfirmPaymentSuccess(false)}>
              <Text style={[styles.buttonText, {color: colors.danger}]}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.oliveGreenFade}]}
              onPress={callback}>
              <Text style={[styles.buttonText, {color: colors.oliveGreen}]}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.6,
    maxHeight:450,
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
  changeidContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  saveButtonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: 10,
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
  textItem: {
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: '500',
    paddingLeft: 4,
  },
  textContent: {
    fontWeight: '400',
    color: '#7e7e7e',
    fontSize: 12,
  },
  changeIDButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default ScanQRToPay;
