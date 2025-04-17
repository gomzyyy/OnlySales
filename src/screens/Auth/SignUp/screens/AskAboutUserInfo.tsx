import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceHeight} from '../../../../utils/Constants';
import {navigate} from '../../../../utils/nagivationUtils';
import BusinessTypePicker from '../../../../components/BusinessTypePicker';
import {BusinessType} from '../../../../../enums';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {isValidEmail, showToast} from '../../../../service/fn';
import CurrencyPicker from '../../../../components/CurrencyPicker';
import {signupAPI} from '../../../../api/api.auth';
import {ValidateReferralCodeOtpAPI} from '../../../../api/api.validate';

type AskAboutUserInfoParams = {
  name: string;
  userId: string;
  businessPhoneNumber: string;
};

const AskAboutUserInfo = () => {
  const {params} = useRoute();
  const {name, userId, businessPhoneNumber} = params as AskAboutUserInfoParams;
  const {currentTheme} = useTheme();
  const [businessType, setBusinessType] = useState<BusinessType>(
    BusinessType.RETAIL,
  );
  const [businessName, setBusinessName] = useState<string>('');
  const [askBusinessDescription, setAskBusinessDescription] =
    useState<boolean>(false);
  const [businessDiscription, setBusinessDescription] = useState<string | null>(
    null,
  );
  const [businessAddress, setBusinessAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [hasReferralCode, setHasReferralCode] = useState<boolean>(false);
  const [hasPromoCode, setHasPromoCode] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string | undefined>('');
  const [referralCode, setReferralCode] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetBusinessType = async () => {
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
        text1: 'Name & address should between 4-64 characters!',
        position: 'top',
      });
      return;
    }
    if (
      (businessType === BusinessType.OTHER &&
        businessDiscription &&
        businessDiscription.trim().length === 0) ||
      (businessType === BusinessType.OTHER &&
        businessDiscription &&
        businessDiscription.trim().length < 4) ||
      (businessType === BusinessType.OTHER &&
        businessDiscription &&
        businessDiscription?.trim().length > 64)
    ) {
      showToast({
        type: 'error',
        text1: 'Description should between 4-64 characters!',
        position: 'top',
      });
      return;
    }
    if (!isValidEmail(email)) {
      showToast({
        type: 'error',
        text1: 'Please enter a valid email.',
        position: 'top',
      });
      return;
    }
    if (referralCode && referralCode.trim().length === 0) {
      setReferralCode(undefined);
    }
    if (referralCode) {
      const res = await ValidateReferralCodeOtpAPI(
        {query: {referralCode}},
        setLoading,
      );
      console.log(res);
      if (!res.success) {
        showToast({type: 'error', text1: res.message});
        return;
      }
    }
    const params = {
      name,
      userId,
      businessName,
      businessType,
      businessDiscription,
      businessPhoneNumber,
      businessAddress,
      email,
      referralCode,
    };
    navigate('SetPassword', params);
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
            <Text style={styles.inputLabel}>Your Business email:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="email here."
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
          <View style={{flexDirection: 'row'}}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 10,
                marginTop: 10,
              }}
              onPress={() => setHasReferralCode(!hasReferralCode)}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 7,
                  height: 14,
                  width: 14,
                  padding: 3,
                }}>
                <View
                  style={{
                    backgroundColor: hasReferralCode
                      ? currentTheme.baseColor
                      : '',
                    flex: 1,
                    borderRadius: 10,
                  }}
                />
              </View>
              <Text style={{fontSize: 14, fontWeight: 400}}>
                I have a referral code!
              </Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingHorizontal: 10,
                marginTop: 10,
              }}
              onPress={() => setHasPromoCode(!hasPromoCode)}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 7,
                  height: 14,
                  width: 14,
                  padding: 3,
                }}>
                <View
                  style={{
                    backgroundColor: hasPromoCode ? currentTheme.baseColor : '',
                    flex: 1,
                    borderRadius: 10,
                  }}
                />
              </View>
              <Text style={{fontSize: 14, fontWeight: 400}}>
                I have a promo code!
              </Text>
            </Pressable>
          </View>
          {hasReferralCode && (
            <View style={[styles.inputContainer, {marginTop: 0}]}>
              <Text style={styles.inputLabel}>Enter Referral code:</Text>
              <TextInput
                value={referralCode}
                onChangeText={v => setReferralCode(v.toUpperCase())}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Referral code here."
                placeholderTextColor={currentTheme.baseColor}
              />
              <Text style={{fontSize: 12, fontWeight: 400}}>
                *Get Full Access with a 7-Day Premium Pass using Referral Code!
              </Text>
            </View>
          )}
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
                value={businessDiscription || ''}
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
            {loading ? (
              <ActivityIndicator size={18} color={currentTheme.contrastColor} />
            ) : (
              <Icon
                name="rightcircle"
                size={22}
                color={currentTheme.contrastColor}
              />
            )}
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
