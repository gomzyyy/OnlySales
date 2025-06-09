import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Header from '../../../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../store/store';
import {colors, deviceHeight} from '../../../../utils/Constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useStorage, useTheme} from '../../../../hooks/index';
import {back} from '../../../../utils/nagivationUtils';
import {debounce, showToast, throttle} from '../../../../service/fn';
import {Owner} from '../../../../../types';
import {updatePasscodeAPI, verifyPasscodeAPI} from '../../../../api/api.user';
import InputPasscode from '../../../../customComponents/InputPasscode';

const SetPasscode = () => {
  const {currentTheme} = useTheme();
  const {user} = useStorage();
  const u = useSelector((s: RootState) => s.appData.user)!;
  const {accessPasscode, isLocked} = u;

  const [currPasscode, setCurrPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [currPasscodeError, setCurrPasscodeError] = useState<boolean>(false);
  const [currPasscodeSuccess, setCurrPasscodeSuccess] =
    useState<boolean>(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [changingState, setChangingState] = useState<boolean>(false);

  useEffect(() => {
    setPasswordConfirmed(newPasscode === confirmPasscode);
  }, [newPasscode, confirmPasscode]);

  const handleSaveButton = async () => {
    if (newPasscode.length < 4 || newPasscode.length > 16) {
      showToast({
        type: 'error',
        text1: 'Passcode must be 4-16 digits.',
      });
      return;
    }

    if (!passwordConfirmed) {
      showToast({
        type: 'error',
        text1: 'Passwords do not match!',
      });
      return;
    }

    const res = await user.updateAppPasscode({
      query: {role: u.role},
      body: {newPasscode, currPasscode},
    });
    showToast({
      type: res.success ? 'success' : 'error',
      text1: res.message,
    });
    if (res.success) back();
  };

  const checkCurrPasscode = async (passcode: string) => {
    setCurrPasscodeSuccess(false);
    const res = await verifyPasscodeAPI(
      {
        query: {role: u.role},
        body: {passcode},
      },
      setLoading,
    );
    if (!res.success) {
      setCurrPasscodeError(true);
    } else {
      setCurrPasscodeSuccess(true);
    }
  };

  const debouncedCheck = useRef(debounce(checkCurrPasscode, 800)).current;
  useEffect(() => {
    if (currPasscode.trim().length === 0) return;
    debouncedCheck(currPasscode);
  }, [currPasscode]);

  const updateLockState = useCallback(async () => {
    await user.changeAppLockState(
      {
        query: {role: u.role},
        body: {state: u.isLocked ? 0 : 1},
      },
      setChangingState,
    );
  }, [user, u.role, u.isLocked]);

  const throttledCall = useRef(throttle(updateLockState, 800));

  useEffect(() => {
    throttledCall.current = throttle(updateLockState, 800);
  }, [updateLockState]);

  const ToogleButton = () => {
    if (u.accessPasscode.length === 0) {
      return null;
    }
    return (
      <View
        style={{
          backgroundColor: u.isLocked ? colors.oliveGreen : colors.danger,
          height: 24,
          width: 32,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {changingState ? (
          <ActivityIndicator size={14} color={'#fff'} />
        ) : (
          <Text style={{fontWeight: '600', color: '#fff'}}>
            {u.isLocked ? 'On' : 'Off'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <Header
        name="App Lock"
        backButton={true}
        customComponent={true}
        renderItem={<ToogleButton />}
        customAction={() => throttledCall.current()}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{flex: 1, paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            {(isLocked || accessPasscode.trim().length > 0) && (
              <View style={styles.inputContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.inputLabel}>Enter Current Passcode</Text>
                  {loading && <ActivityIndicator size={14} color={'#000'} />}
                </View>
                <InputPasscode
                  value={currPasscode}
                  setState={setCurrPasscode}
                  placeholder="current passcode"
                />
                {!currPasscodeSuccess && (
                  <Text
                    style={{
                      color: colors.danger,
                      fontSize: 14,
                      paddingHorizontal: 20,
                    }}>
                    {currPasscodeError ? 'Invalid passcode' : ''}
                  </Text>
                )}
                {currPasscodeSuccess && (
                  <Text
                    style={{
                      color: colors.oliveGreen,
                      fontSize: 14,
                      paddingHorizontal: 20,
                    }}>
                    {'passcode matched!'}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter New Passcode</Text>
              <InputPasscode
                value={newPasscode}
                setState={setNewPasscode}
                placeholder="new passcode"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Passcode</Text>
              <InputPasscode
                value={confirmPasscode}
                setState={setConfirmPasscode}
                placeholder="confirm passcode"
              />
              {!passwordConfirmed &&
                confirmPasscode.length === 4 &&
                newPasscode.length === 4 && (
                  <Text style={[styles.errorMessage, {color: colors.danger}]}>
                    Passwords do not match
                  </Text>
                )}
            </View>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {backgroundColor: currentTheme.baseColor},
              ]}
              onPress={handleSaveButton}>
              <Text
                style={[
                  styles.saveButtonText,
                  {color: currentTheme.contrastColor},
                ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  innerContainer: {
    flex: 1,
    marginTop: deviceHeight * 0.08,
    gap: 26,
  },
  inputContainer: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    color: '#000',
  },
  errorMessage: {
    paddingHorizontal: 28,
    fontSize: 16,
    fontWeight: '400',
  },
  saveButton: {
    marginTop: deviceHeight * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 18,
  },
  saveButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default SetPasscode;
