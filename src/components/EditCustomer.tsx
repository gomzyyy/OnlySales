import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {Customer} from '../../types';
import {AppDispatch, RootState} from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '../service/fn';
import {useAnalytics, useStorage, useTheme} from '../hooks';
import SlideUpContainer from './SlideUpContainer';
import FilePicker from './FilePicker';
import { global } from '../styles/global';

type EditCustomerProps = {
  i: Customer;
  close: () => void;
};

const EditCustomer: React.FC<EditCustomerProps> = ({
  i,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
   const {customer} = useStorage()
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [name, setName] = useState<string>(i.name);
  const [phoneNumber, setphoneNumber] = useState<string>(i.phoneNumber || '');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>(i.address || '');
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const SaveUpdatedCustomer = async () => {
    if (name.trim().length === 0) {
      showToast({type: 'info', text1: "Name can't be empty"});
      close();
      return;
    }
    if (phoneNumber.length > 0 && phoneNumber.length !== 10) {
      showToast({type: 'info', text1: 'Enter a valid phone number'});
      close();
      return;
    }
    const data = {
      query: {
        customerId: i._id,
        ownerId: owner._id,
        role: user.role,
      },
      body: {
        name,
        phoneNumber,
        address,
      },
      media: {image},
    };
    const res = await customer.update(data, setLoading);
    showToast({type: res.success ? 'success' : 'error', text1: res.message});
    close();
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
        Edit {i.name}
      </Text>
      <ScrollView
        style={{flex: 1}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Customer name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter name"
              placeholderTextColor={'grey'}
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
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter phone number"
              placeholderTextColor={'grey'}
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
                global.inputText,
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
                title="Choose Profile Image"
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
            onPress={SaveUpdatedCustomer}>
            {loading ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.saveButtonText,
                    {color: currentTheme.modal.saveBtnText},
                  ]}>
                  Please wait
                </Text>
                <ActivityIndicator
                  size={18}
                  color={currentTheme.contrastColor}
                />
              </View>
            ) : (
              <Text
                style={[
                  styles.saveButtonText,
                  {color: currentTheme.modal.saveBtnText},
                ]}>
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <SlideUpContainer
          opacity={0.2}
          open={openImagePicker}
          close={closeImagePicker}
          height={220}>
          <FilePicker
            value={image}
            setState={setImage}
            callback={closeImagePicker}
            type="photo"
          />
        </SlideUpContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingHorizontal: 20,
    height: deviceHeight * 0.52,
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 20,
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
