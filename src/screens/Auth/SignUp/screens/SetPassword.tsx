import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors, deviceHeight} from '../../../../utils/Constants';
import {navigate} from '../../../../utils/nagivationUtils';
import {AdminRole, BusinessType} from '../../../../../enums';
import {useRoute} from '@react-navigation/native';
import {showToast} from '../../../../service/fn';
import CurrencyPicker from '../../../../components/CurrencyPicker';
import {signupAPI} from '../../../../api/api.auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {setUser} from '../../../../../store/slices/business';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {global} from '../../../../styles/global';
import PopupContainer from '../../../../components/PopUp';
import InputPasscode from '../../../../customComponents/InputPasscode';

type SetPasswordParams = {
  name: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  businessDiscription?: string | null;
  businessPhoneNumber: string;
  businessAddress: string;
  email: string;
  referralCode: string | undefined;
  image: string | undefined;
};

const SetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {params} = useRoute();
  const {
    name,
    userId,
    businessPhoneNumber,
    businessAddress,
    businessDiscription,
    businessName,
    businessType,
    email,
    referralCode,
    image,
  } = params as SetPasswordParams;
  const {currentTheme} = useTheme();
  let refCode: string | undefined;
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMatched, setPasswordMatched] = useState<boolean>(true);
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] =
    useState<boolean>(true);
  const [acceptTnc, setAcceptTnc] = useState<boolean>(false);
  const [acceptPp, setAcceptPp] = useState<boolean>(false);
  const [openTpPrompt, setOpenTpPrompt] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const confirmPasswordInputRef = useRef<TextInput>(null);
  const validPassword =
    password.trim().length >= 6 || password.trim().length <= 16;

  const matchPassword = () => {
    if (
      confirmPassword.trim().length !== 0 &&
      confirmPassword.trim() !== password.trim()
    ) {
      setPasswordMatched(false);
      return;
    } else {
      setPasswordMatched(true);
    }
  };
  const handleNextButton = async () => {
    const signupData = {
      query: {},
      body: {
        name,
        userId,
        businessPhoneNumber,
        businessAddress,
        businessDiscription,
        businessName,
        businessType,
        email,
        password,
        role: AdminRole.OWNER,
        uniqueReferralCode:
          referralCode && referralCode.trim().length !== 0
            ? referralCode
            : undefined,
      },
      media: {
        image,
      },
    };
    const res = await signupAPI(signupData, setLoading);
    if (res.success && res.data && res.data.user && res.data.token) {
      await AsyncStorage.setItem('accessToken', res.data.token);
      dispatch(setUser(res.data.user));
      showToast({type: 'success', text1: 'Signup success.'});
      navigate('Dashboard');
      setOpenTpPrompt(false);
      return;
    } else {
      showToast({type: 'error', text1: res.message});
    }
  };
  const handleProceedBtn = () => {
    if (confirmPassword.trim() !== password.trim() && validPassword) {
      setPasswordMatched(false);
      return;
    }
    if (password.trim().length < 6 || password.trim().length > 16) {
      confirmPasswordInputRef.current && confirmPasswordInputRef.current.blur();
      showToast({
        type: 'error',
        text1: 'Password should between 6-16 characters.',
      });
      return;
    }
    setOpenTpPrompt(true);
  };

  useEffect(() => {
    if (validPassword) {
      matchPassword();
    }
  }, [confirmPassword]);

  const Checkbox = ({checked}: {checked: boolean}) => (
    <View
      style={{
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: currentTheme.baseColor,
        marginRight: 10,
        padding: 2,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: checked ? currentTheme.baseColor : 'transparent',
          borderRadius: 20,
        }}
      />
    </View>
  );

  const handleClosePrompt = () => {
    acceptPp && setAcceptPp(false);
    acceptTnc && setAcceptTnc(false);
    setOpenTpPrompt(false);
  };

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Finishing up.</Text>
        <Text style={styles.subTitle}>
          Make your account secure by setting up a login password.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose a password.</Text>
            <InputPasscode
              value={password}
              setState={setPassword}
              placeholder="password"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm your password.</Text>
            <InputPasscode
              value={confirmPassword}
              setState={setConfirmPassword}
              ref={confirmPasswordInputRef}
              placeholder="confirm here."
              placeholderTextColor={
                passwordMatched ? undefined : colors.danger
              }
              onFocus={() => setPasswordMatched(true)}
              onBlur={matchPassword}
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
            onPress={handleProceedBtn}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              Proceed
            </Text>
            {loading ? (
              <ActivityIndicator color={currentTheme.contrastColor} size={18} />
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
      <PopupContainer open={openTpPrompt} close={handleClosePrompt}>
        <View
          style={{
            height: 360,
            backgroundColor: currentTheme.contrastColor,
            padding: 24,
            justifyContent: 'center',
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: currentTheme.textColor,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            Accept Our Terms & Privacy Policy
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: currentTheme.textAlt,
              textAlign: 'center',
              marginBottom: 24,
            }}>
            To continue, you must accept our Terms & Conditions and Privacy
            Policy.
          </Text>

          {/* T&C Row */}
          <Pressable
            onPress={() => setAcceptTnc(!acceptTnc)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <Checkbox checked={acceptTnc} />
            <Text style={{color: currentTheme.textColor}}>
              I agree to the{' '}
              <Text
                style={{
                  color: currentTheme.baseColor,
                  textDecorationLine: 'underline',
                }}
                onPress={() => navigate('TermsAndConditions')}>
                Terms & Conditions
              </Text>
            </Text>
          </Pressable>

          {/* Privacy Policy Row */}
          <Pressable
            onPress={() => setAcceptPp(!acceptPp)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 24,
            }}>
            <Checkbox checked={acceptPp} />
            <Text style={{color: currentTheme.textColor}}>
              I agree to the{' '}
              <Text
                style={{
                  color: currentTheme.baseColor,
                  textDecorationLine: 'underline',
                }}
                onPress={() => navigate('TermsAndConditions')}>
                Privacy Policy
              </Text>
            </Text>
          </Pressable>

          <TouchableOpacity
            onPress={handleNextButton}
            disabled={!acceptPp || !acceptTnc}
            style={{
              backgroundColor:
                acceptPp && acceptTnc ? currentTheme.baseColor : '#ababab',
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}
            activeOpacity={0.8}>
            {loading ? (
              <View style={{flexDirection: 'row', gap: 6}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: currentTheme.contrastColor,
                    fontSize: 16,
                  }}>
                  Finishing up
                </Text>
                <ActivityIndicator
                  size={16}
                  color={currentTheme.contrastColor}
                />
              </View>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: currentTheme.contrastColor,
                  fontSize: 16,
                }}>
                {acceptPp && acceptTnc
                  ? "Let's Finish"
                  : 'Accept terms to proceed.'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </PopupContainer>
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

export default SetPassword;
