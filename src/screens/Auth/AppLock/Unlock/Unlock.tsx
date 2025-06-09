import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Owner} from '../../../../../types';
import {colors, deviceHeight} from '../../../../utils/Constants';
import {showToast} from '../../../../service/fn';
import {resetAndNavigate} from '../../../../utils/nagivationUtils';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../store/store';
import {verifyPasscodeAPI} from '../../../../api/api.user';
import {useTheme} from '../../../../hooks';
import InputPasscode from '../../../../customComponents/InputPasscode';
import {setLockedState} from '../../../../../store/slices/business';
import {useRoute} from '@react-navigation/native';

type UnlockParamsType = {
  navigateTo?: string;
};

const Unlock = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {params} = useRoute();
  const {navigateTo} = (params || {}) as UnlockParamsType;
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const passcodeInputTextRef = useRef<TextInput | null>(null);

  const handleVerifyPasscode = async () => {
    passcodeInputTextRef.current?.blur();
    if (passcode.length < 4 || passcode.length > 16) {
      showToast({
        type: 'error',
        text1: 'Password length should be 4-16 characters.',
      });
    }
    const res = await verifyPasscodeAPI({
      query: {role: user.role},
      body: {passcode},
    });
    if (!res.success) {
      setError(true);
      passcodeInputTextRef.current?.focus();
      showToast({type: 'error', text1: res.message});
    } else {
      dispatch(setLockedState(false));
      resetAndNavigate(`${navigateTo ? navigateTo : 'SplashScreen'}`, {
        locked: false,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* <Header name="App Locked!" /> */}
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* <Text style={styles.title}>
          {localCheck ? 'Is this really you?' : `Welcome back ${user.name}!`}
          This Business is secured.
        </Text> */}
        <Text style={styles.subTitle}>Please Enter your Passcode</Text>

        <View style={styles.inputPasscodeContainer}>
          <InputPasscode
            value={passcode}
            setState={setPasscode}
            ref={passcodeInputTextRef}
            placeholder="access code"
            placeholderTextColor="#999"
            onSubmitEditing={handleVerifyPasscode}
            autoFocus
          />
          {error && (
            <Text style={[styles.errorMessage, {color: colors.danger}]}>
              Incorrect passcode. Try again.
            </Text>
          )}
        </View>
        {/* {!localCheck && <Text style={styles.seperatorText}>OR</Text>}

        {!localCheck && (
          <Pressable onPress={() => navigate('LoginOptions')}>
            <Text style={[styles.altLoginOptionText, {color: colors.link}]}>
              Login with a different Account.
            </Text>
          </Pressable>
        )} */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.24,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.28,
    paddingHorizontal: 18,
  },
  inputPasscodeContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  passcodeInput: {
    fontSize: 14,
    borderBottomWidth: 2,
    width: '60%',
    textAlign: 'center',
    paddingVertical: 10,
    borderColor: '#ccc',
    color: '#000',
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Unlock;
