import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
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

type SetPasswordParams = {
  name: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  businessDiscription?: string | null;
  businessPhoneNumber: string;
  businessAddress: string;
  email: string;
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
  } = params as SetPasswordParams;
  const {currentTheme} = useTheme();

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMatched, setPasswordMatched] = useState<boolean>(true);
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] =
    useState<boolean>(true);
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
    const signupData = {
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
    };
    const res = await signupAPI(signupData, setLoading);
    if (res.success && res.data && res.data.user && res.data.token) {
      await AsyncStorage.setItem('accessToken', res.data.token);
      dispatch(setUser(res.data.user));
      showToast({type: 'success', text1: 'Signup success.'});
      navigate('Dashboard');
      return;
    } else {
      showToast({type: 'error', text1: res.message});
    }
  };

  useEffect(() => {
    if (validPassword) {
      matchPassword();
    }
  }, [confirmPassword]);

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.title}>Let's Talk about your business.</Text>
        <Text style={styles.subTitle}>
          Please let us know about your business.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose a password.</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="password here."
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm your password.</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              ref={confirmPasswordInputRef}
              style={[
                styles.inputText,
                {
                  borderColor: passwordMatched
                    ? currentTheme.modal.inputBorder
                    : colors.danger,
                  color: passwordMatched ? 'black' : colors.danger,
                },
              ]}
              placeholder="confirm here."
              placeholderTextColor={
                passwordMatched ? currentTheme.baseColor : colors.danger
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
            onPress={handleNextButton}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              Proceed
            </Text>
            {loading ? (
              <ActivityIndicator />
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

export default SetPassword;
