import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../hooks';
import Header from '../../../components/Header';
import { useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {isNumber} from '../../../service/test';

const EMICalculator: React.FC = (): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const currency = useSelector((s: RootState) => s.appData.app.currency);

  // EMI Calculator States
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [emi, setEmi] = useState<number | null>(null);

  const calculateEMI = () => {
    if (
      !isNumber(loanAmount) ||
      !isNumber(interestRate) ||
      !isNumber(loanTerm)
    ) {
      alert('Please enter valid numbers.');
      return;
    }

    const principal = parseFloat(loanAmount);
    const rateOfInterest = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanTerm);

    const emiAmount =
      (principal * rateOfInterest * Math.pow(1 + rateOfInterest, months)) /
      (Math.pow(1 + rateOfInterest, months) - 1);

    setEmi(emiAmount);
  };

  return (
    <KeyboardAvoidingView
      style={styles.parent}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{flex: 1}}>
        <Header
          name="EMI Calculator"
          headerBgColor={currentTheme.baseColor}
          titleColor={currentTheme.header.textColor}
          backButtom
          customComponentActiveOpacity={1}
        />

        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Loan Amount:
            </Text>
            <TextInput
              value={loanAmount}
              onChangeText={setLoanAmount}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter loan amount"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Interest Rate (Annual %):
            </Text>
            <TextInput
              value={interestRate}
              onChangeText={setInterestRate}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter interest rate"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Loan Term (Months):
            </Text>
            <TextInput
              value={loanTerm}
              onChangeText={setLoanTerm}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter loan term"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              {backgroundColor: currentTheme.modal.saveBtnbg},
            ]}
            activeOpacity={0.8}
            onPress={calculateEMI}>
            <Text
              style={[
                styles.saveButtonText,
                {color: currentTheme.modal.saveBtnText},
              ]}>
              Calculate EMI
            </Text>
          </TouchableOpacity>

          {emi !== null && (
            <View style={styles.resultContainer}>
              <Text
                style={[styles.resultText, {color: currentTheme.modal.title}]}>
                Your Monthly EMI: {currency} {emi.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  formContainer: {
    paddingHorizontal: 10,
    marginVertical: 20,
    gap: 16,
  },
  inputTitleContainer: {
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EMICalculator;
