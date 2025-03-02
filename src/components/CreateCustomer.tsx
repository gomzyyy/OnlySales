import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {currentTheme} from '../utils/Constants';
import {showToast} from '../service/fn';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {createCustomers} from '../../store/slices/shopkeeper';

type CreateCustomerProps = {
  callback: () => void;
};

const CreateCustomer: React.FC<CreateCustomerProps> = ({
  callback,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setphoneNumber] = useState<string>('');
  // const [image, setImage] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const handleSaveBtn = () => {
    const customerData = {
      fullName,
      phoneNumber,
      address,
    };
    if (fullName.trim().length === 0) {
      showToast({
        type: 'error',
        text1: "Can't add new customer.",
        text2: 'Some required fields are empty.',
      });
      callback();
      return;
    }
    dispatch(createCustomers(customerData));
    showToast({
      type: 'success',
      text1: 'Customer created Successfully.',
      text2: 'Pleas add products to create Udhars.',
    });
    callback();
  };

  return (
    <KeyboardAvoidingView
      style={styles.createCustomerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.formTitle}>Create Customer</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Customer name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.inputText}
            placeholder="Enter name"
            placeholderTextColor={currentTheme.modal.inputText}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Customer phone number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setphoneNumber}
            style={styles.inputText}
            placeholder="Enter phone number"
            placeholderTextColor={currentTheme.modal.inputText}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Customer address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={styles.inputText}
            placeholder="Enter address"
            placeholderTextColor={currentTheme.modal.inputText}
          />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSaveBtn}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.51,
    borderRadius: 20,
    marginBottom:10
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: currentTheme.modal.title,
  },
  formContainer: {
    marginTop: 20,
    gap: 16,
  },
  inputTitleContainer: {
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '400',
    color: currentTheme.modal.title,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: currentTheme.modal.inputBorder,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: currentTheme.modal.saveBtnbg,
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: currentTheme.modal.saveBtnText,
  },
});

export default CreateCustomer;
