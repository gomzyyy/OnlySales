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
import ShopkeeperInfo from '../components/ShopkeeperInfo';
import {TextInput} from 'react-native-gesture-handler';
import useTheme from '../../../hooks/useTheme';
import {AdminRole, BusinessType} from '../../../../enums';
import {Confirm, showToast} from '../../../service/fn';
import {setAdmin} from '../../../../store/slices/shopkeeper';
import RolePicker from '../../../components/RolePicker';
import BusinessTypePicker from '../../../components/BusinessTypePicker';

const MyProfile = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);

  const [name, setName] = useState<string>(shopkeeper.name);
  const [role, setRole] = useState<AdminRole>(shopkeeper.role);
  const [businessType, setBusinessType] = useState<BusinessType>(
    shopkeeper.businessType,
  );

  const [edited, setEdited] = useState<boolean>(false);

  const handleProfileEdit = async () => {
    if (
      name.trim().length === 0 ||
      name.trim().length < 4 ||
      name.trim().length > 16
    ) {
      showToast({type: 'error', text1: 'Name should 4-16 characters long.'});
      return;
    }
    const res = await Confirm(
      'Save changes?',
      'are you sure you have entered correct details?',
    );
    if (!res) return;
    dispatch(setAdmin({...shopkeeper, name, role, businessType}));
    showToast({type: 'success', text1: 'Profile edited successfully.'});
  };
  const checkIfEdited = () => {
    if (
      name.trim() !== shopkeeper.name.trim() ||
      role !== shopkeeper.role ||
      businessType !== shopkeeper.businessType
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  };

  useEffect(() => {
    checkIfEdited();
  }, [name, role, businessType, shopkeeper]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Header
          name="My Profile"
          backButtom
          customComponent={edited}
          renderItem={<Text style={{fontSize: 20}}>Save</Text>}
          customAction={handleProfileEdit}
        />
        <View style={styles.settingsContainer}>
          <View style={styles.infoContainer}>
            <ShopkeeperInfo shopkeeper={shopkeeper} />
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
              <Text style={styles.inputLabel}>Registered role:</Text>
              <RolePicker value={shopkeeper.role} setState={setRole} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Registered business type:</Text>
              <BusinessTypePicker
                enabled={true}
                value={shopkeeper.businessType}
                setState={setBusinessType}
              />
            </View>
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
