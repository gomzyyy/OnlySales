import {TouchableOpacity, View} from 'react-native';
import React, {SetStateAction, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Header from '../../components/Header';
import {useTheme} from '../../hooks';
import QRCode from 'react-native-qrcode-svg';
import {useRoute} from '@react-navigation/native';
import {randomId} from '../../service/fn';
import {CurrencyType} from '../../../enums';
import {back} from '../../utils/nagivationUtils';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isFloat} from '../../service/test';
import {colors, deviceHeight} from '../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';

type RequestedPaymentProps = {
  value: number;
  setState: React.Dispatch<SetStateAction<number>>;
  cancel: () => void;
  currency: CurrencyType;
  callback: () => void;
  editable?: boolean;
};

const RequestedPayment: React.FC<RequestedPaymentProps> = ({
  value,
  setState,
  cancel,
  currency,
  callback,
  editable = true,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const handleSetAmount = (val: string) => {
    if (val.trim().length === 0) {
      setState(0);
    }
    if (!isFloat(val)) {
      return;
    }
    setState(Number(val));
  };
  const handlePay = async () => {
    const pa = await AsyncStorage.getItem('pa');
    const pn = await AsyncStorage.getItem('pn');
    if (!pa || !pn) {
      cancel();
    }
    callback();
  };
  const cancelPay = () => cancel();
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>Confirm Payment</Text>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: currentTheme.bottomTabBg},
        ]}>
        <Text
          style={{
            fontSize: 38,
            color: '#000',
            marginBottom: 10,
          }}>
          {currency}
        </Text>
        <TextInput
          value={value.toString()}
          onChangeText={handleSetAmount}
          style={[
            {
              color: '#000',
            },
            styles.input,
          ]}
          editable={editable}
          keyboardType="numeric"
          autoFocus
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {borderColor: colors.danger, borderWidth: 2}]}
          onPress={cancelPay}>
          <Text style={[styles.buttonText, {color: colors.danger}]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {borderColor: '#9ec378', borderWidth: 2}]}
          onPress={handlePay}>
          <Text style={[styles.buttonText, {color: '#9ec378'}]}>
            Pay {`${value}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight,
    marginBottom: 10,
    borderRadius: 20,
    padding: 20,
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    fontSize: 38,
    fontWeight: 'semibold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default RequestedPayment;
