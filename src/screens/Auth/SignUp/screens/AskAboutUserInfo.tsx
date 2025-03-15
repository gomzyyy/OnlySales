import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceHeight} from '../../../../utils/Constants';
import {navigate} from '../../../../utils/nagivationUtils';
import BusinessTypePicker from '../../../../components/BusinessTypePicker';
import {BusinessType, CurrencyType} from '../../../../../enums';
import {useRoute} from '@react-navigation/native';
import {setShopkeeper} from '../../../../../store/slices/shopkeeper';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {showToast} from '../../../../service/fn';
import CurrencyPicker from '../../../../components/CurrencyPicker';

type AskAboutUserInfoParams = {
  name: string;
  userId: string;
};

const AskAboutUserInfo = () => {
  const {params} = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const {name, userId} = params as AskAboutUserInfoParams;
  const {currentTheme} = useTheme();
  const [businessType, setBusinessType] = useState<BusinessType>(
    BusinessType.RETAIL,
  );
  const [currency, setCurrency] = useState<CurrencyType>(CurrencyType.INR);
  const [businessName, setBusinessName] = useState<string>('');
  const [askBusinessDescription, setAskBusinessDescription] =
    useState<boolean>(false);
  const [businessDiscription, setBusinessDescription] = useState<string>('');
  const [businessAddress, setBusinessAddress] = useState<string>('');

  const handleSetBusinessType = () => {
    if (
      !businessName ||
      businessName.trim().length === 0 ||
      !businessAddress ||
      businessAddress.trim().length === 0
    ) {
      showToast({type: 'error', text1: 'Some business details are missing.'});
      return;
    } else if (
      businessName.length < 4 ||
      businessName.length > 64 ||
      businessAddress.length < 4 ||
      businessAddress.length > 64
    ) {
      showToast({
        type: 'error',
        text1: "Name & address should between 4-64 characters!",
        position: 'top',
      });
      return;
    }
    if (
      (businessType === BusinessType.OTHER &&
        businessDiscription.trim().length === 0) ||
      (businessType === BusinessType.OTHER &&
        businessDiscription.trim().length < 4) ||
      (businessType === BusinessType.OTHER &&
        businessDiscription.trim().length > 64)
    ) {
      showToast({
        type: 'error',
        text1: 'Description should between 4-64 characters!',
        position: 'top',
      });
      return;
    }
    const signupData = {
      name,
      userId,
      businessName,
      businessType,
      businessDiscription,
      currency
    };
    dispatch(setShopkeeper(signupData));
    navigate('SignupSuccess');
  };
  useEffect(() => {
    if (businessType === BusinessType.OTHER) {
      setAskBusinessDescription(true);
    } else {
      setAskBusinessDescription(false);
    }
  }, [businessType]);
  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.title}>Let's Talk about your business.</Text>
        <Text style={styles.subTitle}>
          Please let us know about your business.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your business name:</Text>
            <TextInput
              value={businessName}
              onChangeText={setBusinessName}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Your business name here."
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your business address:</Text>
            <TextInput
              value={businessAddress}
              onChangeText={setBusinessAddress}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Your business address here."
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose your business type:</Text>
            <BusinessTypePicker
              enabled={true}
              value={businessType}
              setState={setBusinessType}
            />
          </View>
          {askBusinessDescription && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Please describe your business in few words:
              </Text>
              <TextInput
                value={businessDiscription}
                onChangeText={setBusinessDescription}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Describe here."
                placeholderTextColor={currentTheme.baseColor}
              />
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose your currency:</Text>
            <CurrencyPicker
              enabled={true}
              value={currency}
              setState={setCurrency}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={handleSetBusinessType}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              Next
            </Text>
            <Icon
              name="rightcircle"
              size={22}
              color={currentTheme.contrastColor}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.1,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.05,
  },
  formContainer: {
    marginTop: deviceHeight * 0.04,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
    marginTop: deviceHeight * 0.02,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 60,
    fontSize: 22,
    paddingHorizontal: 12,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  proceedButton: {
    marginTop: deviceHeight * 0.06,
    padding: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    alignSelf: 'center',
  },
  proceedButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default AskAboutUserInfo;
