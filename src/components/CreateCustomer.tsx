import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {modifyUserName, showToast} from '../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {useAnalytics, useHaptics, useTheme} from '../hooks/index';
import FilePicker from './FilePicker';
import SlideUpContainer from './SlideUpContainer';
import {createCustomerAPI} from '../api/api.customer';
import {AdminRole} from '../../enums';
import {Employee, Partner} from '../../types';
import {getOwnerAPI} from '../api/api.owner';
import {setUser} from '../../store/slices/business';
import {getUserAPI} from '../api/api.user';
import {useStorage} from '../hooks';

type CreateCustomerProps = {
  callback: () => void;
};

const CreateCustomer: React.FC<CreateCustomerProps> = ({
  callback,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {warning} = useHaptics();
  const {currentTheme} = useTheme();
 const {customer} = useStorage()
  const {role, _id} = useSelector((s: RootState) => s.appData.user)!;
  const [name, setName] = useState<string>('');
  const [phoneNumber, setphoneNumber] = useState<string>('');
  const [image, setImage] = useState<string | undefined>();
  const [address, setAddress] = useState<string>('');
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveBtn = async () => {
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
      businessOwnerId:
        (role === AdminRole.OWNER && _id) ||
        (role === AdminRole.PARTNER &&
          useSelector((s: RootState) => s.appData.user as Partner)!
            .businessOwner._id) ||
        (role === AdminRole.EMPLOYEE &&
          useSelector((s: RootState) => s.appData.user as Employee)!
            .businessOwner._id) ||
        '',
    };
    const res = await customer.create(
      {
        query: {role, createdBy: role, creatorId: _id},
        body: customerData,
        media: {
          image,
        },
      },
      setLoading,
    );
    if (res.success && res.data.customer) {
      const userRes = await getUserAPI({
        role,
      });
      if (userRes.success && userRes.data.user) {
        dispatch(setUser(userRes.data.user));
        showToast({
          type: 'success',
          text1: res.message,
          text2: 'Pleas add products to create Udhars.',
        });
        callback();
        return;
      }
    }
    showToast({
      type: 'error',
      text1: res.message,
      text2: 'Pleas add products to create Udhars.',
    });
    callback();
  };

  const cancelImagePicker = () => {
    setImage(undefined);
    setOpenImagePicker(false);
  };

  const closeImagePicker = () => {
    setOpenImagePicker(false);
  };

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
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Customer name
            </Text>
            <TextInput
              value={name}
              onChangeText={v => setName(modifyUserName(v))}
              style={[
                styles.inputText,
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
                styles.inputText,
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
          <SlideUpContainer
            opacity={0.2}
            open={openImagePicker}
            close={cancelImagePicker}
            height={220}>
            <FilePicker
              value={image}
              setState={setImage}
              callback={closeImagePicker}
              type="image"
            />
          </SlideUpContainer>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    height: deviceHeight * 0.58,
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
