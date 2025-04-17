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
import OwnerInfo from '../components/UserInfo';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../../hooks/index';
import {AdminRole, BusinessType} from '../../../../enums';
import {Confirm, showToast} from '../../../service/fn';
import RolePicker from '../../../components/RolePicker';
import BusinessTypePicker from '../../../components/BusinessTypePicker';
import {isNumber} from '../../../service/test';
import {back} from '../../../utils/nagivationUtils';
import {Employee, Owner, Partner} from '../../../../types';

const MyProfile = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const owner =
    (user.role === AdminRole.OWNER && (user as Owner)) ||
    (user.role === AdminRole.EMPLOYEE && (user as Employee).businessOwner) ||
    (user.role === AdminRole.PARTNER && (user as Partner).businessOwner) ||
    undefined;
  const [name, setName] = useState<string>(owner?.name || '');
  const [profileImageValue, setProfileImageValue] = useState<
    string | undefined
  >(owner?.image);
  const [role, setRole] = useState<AdminRole>(owner?.role || AdminRole.OWNER);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    owner?.phoneNumber?.value ?? '',
  );
  const [businessType, setBusinessType] = useState<BusinessType>(
    owner?.businessType || BusinessType.RETAIL,
  );
  const [edited, setEdited] = useState<boolean>(false);
  const [businessDescription, setBusinessDescription] = useState<string>(
    owner?.businessDescription || '',
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
    if (
      owner &&
      owner.phoneNumber?.value &&
      phoneNumber !== owner.phoneNumber.value
    ) {
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
    // dispatch(
    //   editBusinessOwner({
    //     name,
    //     userId: owner.userId,
    //     phoneNumber,
    //     businessType,
    //     businessDescription,
    //     image:profileImageValue
    //   }),
    // );
    showToast({type: 'success', text1: 'Profile updated successfully.'});
    back();
  };
  const checkIfEdited = () => {
    if (
      name.trim() !== owner?.name.trim() ||
      role !== owner.role ||
      businessType !== owner.businessType ||
      (phoneNumber.trim().length !== 0 &&
        phoneNumber !== owner.phoneNumber?.value) ||
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
          name="My Profile"
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
          curved={true}
        />
        <View style={styles.settingsContainer}>
          <View style={styles.infoContainer}>
            <OwnerInfo
              user={user}
              profileImageValue={profileImageValue}
              setProfileImageValue={setProfileImageValue}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Registered name:</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Enter name"
                placeholderTextColor={currentTheme.baseColor}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Registered Phone Number:</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Enter Phone Number"
                placeholderTextColor={currentTheme.baseColor}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Registered role:</Text>
              <RolePicker
                value={owner?.role || AdminRole.OWNER}
                setState={setRole}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Registered business type:</Text>
              <BusinessTypePicker
                enabled={true}
                value={owner?.businessType || BusinessType.RETAIL}
                setState={setBusinessType}
              />
            </View>
            {businessType === BusinessType.OTHER && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Registered business type:</Text>
                <TextInput
                  value={businessDescription}
                  onChangeText={setBusinessDescription}
                  style={[
                    styles.inputText,
                    {borderColor: currentTheme.modal.inputBorder},
                  ]}
                  placeholder="Describe your business here."
                  placeholderTextColor={currentTheme.baseColor}
                />
              </View>
            )}
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
    marginTop: 10,
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

export default MyProfile;
