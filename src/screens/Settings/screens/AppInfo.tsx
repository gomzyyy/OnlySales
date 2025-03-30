import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import OwnerInfo from '../components/OwnerInfo';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../../hooks/index';
import {AdminRole, BusinessType} from '../../../../enums';
import {Confirm, showToast} from '../../../service/fn';
import {editBusinessOwner} from '../../../../store/slices/business';
import RolePicker from '../../../components/RolePicker';
import BusinessTypePicker from '../../../components/BusinessTypePicker';
import {isNumber} from '../../../service/test';
import {back} from '../../../utils/nagivationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppInfo = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const owner = useSelector((s: RootState) => s.appData.BusinessOwner);
  const [name, setName] = useState<string>(owner.name);
  const [profileImageValue, setProfileImageValue] = useState<
    string | undefined
  >(owner.image);
  const [role, setRole] = useState<AdminRole>(owner.role);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    owner.phoneNumber ?? '',
  );
  const [businessType, setBusinessType] = useState<BusinessType>(
    owner.businessType || BusinessType.RETAIL,
  );
  const [edited, setEdited] = useState<boolean>(false);
  const [businessDescription, setBusinessDescription] = useState<string>(
    owner.businessDescription || '',
  );

  const handleProfileEdit = async () => {
    if (
      name.trim().length === 0 ||
      name.trim().length < 4 ||
      name.trim().length > 16
    ) {
      showToast({type: 'error', text1: 'Name should 4-16 characters long.'});
      return;
    }
    if (owner.phoneNumber && phoneNumber !== owner.phoneNumber) {
      if (
        phoneNumber.trim().length === 0 ||
        phoneNumber.trim().length > 10 ||
        phoneNumber.trim().length < 10 ||
        !isNumber(phoneNumber)
      ) {
        showToast({type: 'error', text1: 'Please enter a valid phone number'});
        return;
      }
    }

    const res = await Confirm(
      'Save changes?',
      'are you sure you have entered correct details?',
    );
    if (!res) return;
    dispatch(
      editBusinessOwner({
        name,
        userId: owner.userId,
        phoneNumber,
        businessType,
        businessDescription,
        image: profileImageValue,
      }),
    );
    showToast({type: 'success', text1: 'Profile updated successfully.'});
    back();
  };
  const checkIfEdited = () => {
    if (
      name.trim() !== owner.name.trim() ||
      role !== owner.role ||
      businessType !== owner.businessType ||
      (phoneNumber.trim().length !== 0 && phoneNumber !== owner.phoneNumber) ||
      (businessType === BusinessType.OTHER &&
        businessDescription.trim().length !== 0 &&
        businessDescription !== owner.businessDescription) ||
      owner.image !== profileImageValue
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  };

  useEffect(() => {
    checkIfEdited();
    const getPa = async () => {
      const pa = await AsyncStorage.getItem('pa');
    };
    getPa()
  }, [
    name,
    role,
    businessType,
    owner,
    phoneNumber,
    businessDescription,
    profileImageValue,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Header
          name="App info"
          backButtom
          customComponent={edited}
          renderItem={
            <Text style={{fontSize: 20, color: currentTheme.header.textColor}}>
              Save
            </Text>
          }
          customAction={handleProfileEdit}
          headerBgColor={currentTheme.baseColor}
          titleColor={currentTheme.header.textColor}
        />
        <View style={styles.settingsContainer}>
          <View style={{backgroundColor: currentTheme.baseColor}}>
            <Text>Hello</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  infoContainer: {},
  settingsContainer: {
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  container: {
    marginTop: 20,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
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
});

export default AppInfo;
