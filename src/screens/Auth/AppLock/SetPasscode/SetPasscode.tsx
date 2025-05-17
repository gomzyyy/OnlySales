import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../store/store';
import InputPasscode from '../../../../customComponents/InputPasscode';
import {colors, deviceHeight} from '../../../../utils/Constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../../../hooks/index';
// import {
//   setAccessPassword,
//   toogleLockApp,
// } from '../../../../../store/slices/business';
import {back} from '../../../../utils/nagivationUtils';
import {showToast} from '../../../../service/fn';
import { Owner } from '../../../../../types';

const SetPasscode = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {accessPasscode} = useSelector(
    (s: RootState) => s.appData.user as Owner,
  );
  const {appLocked} = useSelector((s: RootState) => s.appData.app);
  const [locked, setLocked] = useState<boolean>(false);
  const [currPasscodeError, setCurrPasscodeError] = useState<boolean>(false);
  const [currPasscode, setCurrPasscode] = useState<
    [string, string, string, string]
  >(['', '', '', '']);
  const [newPasscode, setNewPasscode] = useState<
    [string, string, string, string]
  >(['', '', '', '']);
  const [confirmPasscode, setConfirmPasscode] = useState<
    [string, string, string, string]
  >(['', '', '', '']);
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false);
  const handlePasswordConfirmed = () => {
    if (
      confirmPasscode[0].trim().length > 0 ||
      confirmPasscode[1].trim().length > 0 ||
      confirmPasscode[2].trim().length > 0 ||
      confirmPasscode[3].trim().length > 0
    ) {
      if (JSON.stringify(confirmPasscode) !== JSON.stringify(newPasscode)) {
        setPasswordConfirmed(false);
      } else {
        setPasswordConfirmed(true);
      }
    }
  };
  const handleSaveButton = () => {
    if (
      locked &&
      JSON.stringify(currPasscode) !== JSON.stringify(accessPasscode)
    ) {
      showToast({
        type: 'error',
        text1: 'Password not matched with current password!',
        position: 'top',
      });
      setCurrPasscode(['', '', '', '']);
      setCurrPasscodeError(true);
      return;
    }

    if (!passwordConfirmed) {
      showToast({
        type: 'error',
        text1: 'Password not matched!',
        position: 'top',
      });
      return;
    }
    // dispatch(setAccessPassword(newPasscode));
    // dispatch(toogleLockApp(true));
    showToast({
      type: 'success',
      text1: locked
        ? 'Passcode changed successfully!'
        : 'App lock enabled successfully!',
    });
    back();
  };
  useEffect(() => {
    handlePasswordConfirmed();
    setLocked(Array.isArray(accessPasscode));
  }, [confirmPasscode, newPasscode, accessPasscode]);
  useEffect(() => {
    if (
      currPasscode[0].trim().length !== 0 ||
      currPasscode[0].trim().length !== 0 ||
      currPasscode[0].trim().length !== 0 ||
      currPasscode[0].trim().length !== 0
    ) {
      setCurrPasscodeError(false);
    }
    handlePasswordConfirmed();
    setLocked(Array.isArray(accessPasscode));
  }, [currPasscode]);
  return (
    <>
      <Header name="Set a new Passcode" backButton={true} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{flex: 1, paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
          <View style={styles.innerContainer}>
            {locked && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Current Passcode</Text>
                <InputPasscode
                  state={currPasscode}
                  setState={setCurrPasscode}
                  focused
                  error={currPasscodeError}
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter New Passcode</Text>
              <InputPasscode
                state={newPasscode}
                setState={setNewPasscode}
                focused={!locked}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Passcode</Text>
              <InputPasscode
                state={confirmPasscode}
                setState={setConfirmPasscode}
              />
              {!passwordConfirmed &&
                confirmPasscode[3].trim().length !== 0 &&
                newPasscode[3].trim().length !== 0 && (
                  <Text style={[styles.errorMessage, {color: colors.danger}]}>
                    Password not matched
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
  errorMessage: {paddingHorizontal: 28, fontSize: 16, fontWeight: '400'},
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
