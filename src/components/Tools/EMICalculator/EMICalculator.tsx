import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../hooks';
import Header from '../../../components/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {isFloat, isNumber} from '../../../service/test';
import {global} from '../../../styles/global';
import {colors} from '../../../utils/Constants';

const EMICalculator: React.FC = (): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const currency = useSelector((s: RootState) => s.appData.app.currency);

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [loanTermDays, setLoanTermDays] = useState<string>('');
  const [addDays, setAddDays] = useState<boolean>(false);
  const [downPayment, setDownPayment] = useState<string>('');
  const [addDownPayment, setAddDownPayment] = useState<boolean>(false);
  const [emi, setEmi] = useState<number | null>(null);

  const calculateEMI = () => {
    if (loanAmount.trim().length === 0 || !isFloat(loanAmount)) {
      alert('Please enter a valid loan amount.');
      return;
    }
    if (interestRate.trim().length === 0 || !isFloat(interestRate)) {
      alert('Please enter a valid interest rate.');
      return;
    }
    if (loanTerm.trim().length === 0 || !isNumber(loanTerm)) {
      alert('Please enter a valid loan term in months.');
      return;
    }
    if (addDownPayment && downPayment.trim() !== '' && !isFloat(downPayment)) {
      alert('Please enter a valid down payment.');
      return;
    }

    const principal = parseFloat(loanAmount);
    const dp = downPayment.trim() !== '' ? parseFloat(downPayment) : 0;
    const effectiveLoan = principal - dp;

    if (effectiveLoan <= 0) {
      alert('Down payment cannot be equal to or more than loan amount.');
      return;
    }

    const rateOfInterest = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm);
    const days = loanTermDays ? parseFloat(loanTermDays) : 0;
    const totalMonths = months + days / 30.44;

    const emiAmount =
      (effectiveLoan *
        rateOfInterest *
        Math.pow(1 + rateOfInterest, totalMonths)) /
      (Math.pow(1 + rateOfInterest, totalMonths) - 1);

    setEmi(emiAmount);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        name="EMI Calculator"
        headerBgColor={currentTheme.fadeColor}
        titleColor={currentTheme.baseColor}
      />
      <View
        style={[
          styles.formContainer,
          {
            backgroundColor: currentTheme.contrastColor,
            borderRadius: 10,
          },
        ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Loan Amount:
            </Text>
            <TextInput
              value={loanAmount}
              onChangeText={setLoanAmount}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter loan amount"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>

          {!addDownPayment && (
            <Pressable onPress={() => setAddDownPayment(true)} style={{marginBottom:20}}>
              <Text style={{fontWeight:'600'}}>+ Add down payment</Text>
            </Pressable>
          )}
          {addDownPayment && (
            <View style={styles.inputTitleContainer}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                Down Payment
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <TextInput
                  value={downPayment}
                  onChangeText={setDownPayment}
                  style={[
                    global.inputText,
                    {
                      borderColor: currentTheme.modal.inputBorder,
                      flex: 1,
                    },
                  ]}
                  placeholder="Enter down payment"
                  placeholderTextColor={'grey'}
                  keyboardType="numeric"
                />
                <Pressable
                  onPress={() => setAddDownPayment(false)}
                  style={{
                    borderRadius: 12,
                    backgroundColor: colors.dangerFade,
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: colors.danger, fontWeight: '600'}}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Interest Rate (Annual %):
            </Text>
            <TextInput
              value={interestRate}
              onChangeText={setInterestRate}
              style={[
                global.inputText,
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
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter loan term"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>

          {/* Toggle Days Field */}
          {!addDays && (
            <Pressable onPress={() => setAddDays(true)} style={{marginBottom:20}}>
           <Text style={{fontWeight:'600'}}>+ Add days</Text>
            </Pressable>
          )}
          {addDays && (
            <View style={styles.inputTitleContainer}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                Add additional Days
              </Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <TextInput
                  value={loanTermDays}
                  onChangeText={setLoanTermDays}
                  style={[
                    global.inputText,
                    {
                      borderColor: currentTheme.modal.inputBorder,
                      flex: 1,
                    },
                  ]}
                  placeholder="Enter additional days"
                  placeholderTextColor={'grey'}
                  keyboardType="numeric"
                />
                <Pressable
                  onPress={() => setAddDays(false)}
                  style={{
                    borderRadius: 12,
                    backgroundColor: colors.dangerFade,
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: colors.danger, fontWeight: '600'}}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

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

          {/* Result */}
          {emi !== null && (
            <View style={styles.resultContainer}>
              <Text
                style={[styles.resultText, {color: currentTheme.modal.title}]}>
                Your Monthly EMI: {currency} {emi.toFixed(2)}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    overflow: 'hidden',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    maxWidth: 600,
  },
  formContainer: {
    padding: 16,
  },
  inputTitleContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  inputText: {
    borderWidth: 1.5,
    borderRadius: 8,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
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
