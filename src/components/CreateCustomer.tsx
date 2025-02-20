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
import {Theme} from '../utils/Constants';
import {showToast} from '../service/fn';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {createCustomers} from '../../store/slices/shopkeeper';

const currentTheme = Theme[0];

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
            placeholderTextColor={'purple'}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Customer phone number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setphoneNumber}
            style={styles.inputText}
            placeholder="Enter phone number"
            placeholderTextColor={'purple'}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Customer address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={styles.inputText}
            placeholder="Enter address"
            placeholderTextColor={'purple'}
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
    backgroundColor: 'rgba(255,255,255,1)',
    height: deviceHeight * 0.51,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
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
    color: currentTheme.baseColor,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'purple',
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: 'purple',
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
});

export default CreateCustomer;
