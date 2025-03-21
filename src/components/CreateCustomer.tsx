import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {showToast} from '../service/fn';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {createCustomers} from '../../store/slices/business';
import {useHaptics, useTheme} from '../hooks/index';
import GetImage from './GetImage';
import SlideUpContainer from './SlideUpContainer';

type CreateCustomerProps = {
  callback: () => void;
};

const CreateCustomer: React.FC<CreateCustomerProps> = ({
  callback,
}): React.JSX.Element => {
  const {warning} = useHaptics();
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>('');
  const [phoneNumber, setphoneNumber] = useState<string>('');
  const [image, setImage] = useState<string | undefined>();
  const [address, setAddress] = useState<string>('');
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);

  const handleSaveBtn = () => {
    if (name.trim().length === 0) {
      warning();
      showToast({
        type: 'info',
        text1: 'Some required fields are empty.',
        position: 'top',
      });
      return;
    }
    const customerData = {
      name,
      phoneNumber,
      address,
      image,
    };
    dispatch(createCustomers(customerData));
    showToast({
      type: 'success',
      text1: 'Customer created Successfully.',
      text2: 'Pleas add products to create Udhars.',
    });
    callback();
  };

  const closeImagePicker = () => setOpenImagePicker(false);

  return (
    <KeyboardAvoidingView
      style={[
        styles.createCustomerContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
        Create Customer
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
            Customer name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[
              styles.inputText,
              {borderColor: currentTheme.modal.inputBorder},
            ]}
            placeholder="Enter name"
            placeholderTextColor={'grey'}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
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
            placeholderTextColor={'grey'}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
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
            placeholderTextColor={'grey'}
          />
        </View>
        {image && image.trim().length !== 0 ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{flex: 1}}>{`${image.slice(0, 40)}...`}</Text>
            <Button title="Remove" onPress={() => setImage(undefined)} />
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 40,
              alignItems: 'center',
            }}>
            <Button
              title="Choose Image"
              onPress={() => setOpenImagePicker(true)}
            />
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {backgroundColor: currentTheme.modal.saveBtnbg},
          ]}
          activeOpacity={0.8}
          onPress={handleSaveBtn}>
          <Text
            style={[
              styles.saveButtonText,
              {color: currentTheme.modal.saveBtnText},
            ]}>
            Save
          </Text>
        </TouchableOpacity>
        <SlideUpContainer
          opacity={0.2}
          open={openImagePicker}
          close={closeImagePicker}>
          <GetImage
            value={image}
            setState={setImage}
            callback={closeImagePicker}
          />
        </SlideUpContainer>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    // height: deviceHeight * 0.55,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    gap: 16,
    marginBottom: 16,
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

export default CreateCustomer;
