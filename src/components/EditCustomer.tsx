import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {Customer} from '../../types';
import {AppDispatch} from '../../store/store';
import {useDispatch} from 'react-redux';
import Tab from '../screens/Dashboard/components/Tab';
import {showToast} from '../service/fn';
import {updateCustomer} from '../../store/slices/shopkeeper';
import useTheme from '../hooks/useTheme';

type EditCustomerProps = {
  i: Customer;
  close: () => void;
};

const EditCustomer: React.FC<EditCustomerProps> = ({
  i,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [fullName, setFullName] = useState<string>(i.fullName);
  const [phoneNumber, setphoneNumber] = useState<string>(i.phoneNumber || '');
  // const [image, setImage] = useState<string>('');
  const [address, setAddress] = useState<string>(i.address || '');
  const [updatedCustomer, setUpdatedCustomer] = useState<Customer>({...i});

  const SaveUpdatedCustomer = () => {
    if (fullName.trim().length === 0) {
      showToast({type: 'info', text1: "Name can't be empty"});
      close();
      return;
    }
    dispatch(updateCustomer({...i, fullName}));
    close();
  };

  return (
    <>
      <Tab i={updatedCustomer} dummy={true} />
      <KeyboardAvoidingView
        style={[
          styles.createCustomerContainer,
          {backgroundColor: currentTheme.contrastColor},
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{flex: 1}} nestedScrollEnabled>
          <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
            Edit Customer: {i.fullName}
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.inputTitleContainer}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                Customer name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={value => {
                  setFullName(value);
                  setUpdatedCustomer({
                    ...i,
                    fullName: value,
                  });
                }}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Enter name"
                placeholderTextColor={currentTheme.modal.inputText}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                Customer phone number
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setphoneNumber}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Enter phone number"
                placeholderTextColor={currentTheme.modal.inputText}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                Customer address
              </Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Enter address"
                placeholderTextColor={currentTheme.modal.inputText}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {backgroundColor: currentTheme.modal.saveBtnbg},
              ]}
              activeOpacity={0.8}
              onPress={SaveUpdatedCustomer}>
              <Text
                style={[
                  styles.saveButtonText,
                  {color: currentTheme.modal.saveBtnText},
                ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingHorizontal: 20,
    height: deviceHeight * 0.52,
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 20,
    elevation:30,
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
});

export default EditCustomer;
