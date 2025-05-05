import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {SetStateAction} from 'react';
import {colors, deviceHeight} from '../utils/Constants';
import {useTheme} from '../hooks';
import {isFloat} from '../service/test';
import {CurrencyType} from '../../enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoldProduct } from '../../types';

type ConfirmPaymentProps = {
  value: number;
  setState: React.Dispatch<SetStateAction<number>>;
  cancel: () => void;
  currency: CurrencyType;
  callback: (soldProduct?:SoldProduct[]) => void;
  editable?: boolean;
  soldProducts:SoldProduct[]
};

const ConfirmPayment: React.FC<ConfirmPaymentProps> = ({
  value,
  setState,
  cancel,
  currency,
  callback,
  editable = true,
  soldProducts
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
    callback(soldProducts);
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
        {/* <Text
          style={{
            fontSize: 38,
            color: '#000',
            marginBottom: 10,
          }}>
          {currency}
        </Text> */}
        <TextInput
          value={`${currency} ${value.toString()}`}
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
    height: deviceHeight * 0.5,
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

export default ConfirmPayment;
