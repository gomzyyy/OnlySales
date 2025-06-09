import {
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {useTheme} from '../../../hooks/index';
import {AdminRole, BusinessType} from '../../../../enums';
import {Confirm, showToast} from '../../../service/fn';
import {isNumber} from '../../../service/test';
import {back} from '../../../utils/nagivationUtils';
import {Employee, Owner, Partner} from '../../../../types';
import OwnerProfile from './components/OwnerProfile';
import EmployeeProfile from './components/EmployeeProfile';

const MyProfile = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const owner =
    (user.role === AdminRole.OWNER && (user as Owner)) ||
    (user.role === AdminRole.EMPLOYEE && (user as Employee).businessOwner) ||
    (user.role === AdminRole.PARTNER && (user as Partner).businessOwner) ||
    undefined;
  const [name, setName] = useState<string>(user?.name || '');
  const [profileImageValue, setProfileImageValue] = useState<
    string | undefined
  >(user?.image);
  const [role, setRole] = useState<AdminRole>(user?.role);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.phoneNumber?.value ?? '',
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
    <>
      {(user.role === AdminRole.OWNER && <OwnerProfile />) ||
        (user.role === AdminRole.EMPLOYEE && <EmployeeProfile />) || <></>}
    </>
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
