import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Shopkeeper} from '../../../../../types';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import InputPasscode from '../../../../customComponents/InputPasscode';
import {colors, deviceHeight} from '../../../../utils/Constants';
import Header from '../../../../components/Header';
import {showToast} from '../../../../service/fn';
import {
  back,
  navigate,
  resetAndNavigate,
} from '../../../../utils/nagivationUtils';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {login} from '../../../../../store/slices/shopkeeper';

type UnlockParamsType = {
  user: Shopkeeper;
  logged?: boolean;
  navigateTo?: string;
  localCheck?: boolean;
};

const Unlock = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {params} = useRoute();
  const {
    user,
    logged = false,
    navigateTo,
    localCheck = false,
  } = params as UnlockParamsType;
  const [passcode, setPasscode] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);

  const [error, setError] = useState<boolean>(false);

  const handleCheckPasscode = () => {
    if (JSON.stringify(user.accessPasscode) === JSON.stringify(passcode)) {
      if (localCheck && navigateTo) {
        navigate(navigateTo);
        return;
      }
      !logged && dispatch(login({userId: user.userId}));
      resetAndNavigate('Dashboard');
      return;
    } else {
      showToast({
        type: 'error',
        text1: 'Incorrect Access Passcode!',
        position: 'top',
      });
      setPasscode(['', '', '', '']);
      setError(true);
      return;
    }
  };

  useEffect(() => {
    if (
      passcode[0].trim().length !== 0 ||
      passcode[1].trim().length !== 0 ||
      passcode[2].trim().length !== 0 ||
      passcode[3].trim().length !== 0
    ) {
      error && setError(false);
    }
    if (
      passcode[0].trim().length !== 0 &&
      passcode[1].trim().length !== 0 &&
      passcode[2].trim().length !== 0 &&
      passcode[3].trim().length !== 0
    ) {
      handleCheckPasscode();
    } else {
      return;
    }
  }, [passcode]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header name="App Locked!" backButtom />
      <ScrollView style={{flex: 1}}>
        <Text style={styles.title}>
          {localCheck ? `Is this really you?` : `Welcome back ${user.name}!`}
        </Text>
        <Text style={styles.subTitle}>{`Please Enter your Passcode`}</Text>
        <View style={styles.inputPasscodeContainer}>
          <InputPasscode
            state={passcode}
            setState={setPasscode}
            focused
            error={error}
          />
        </View>
        {!localCheck && <Text style={styles.seperatorText}>OR</Text>}
        {!localCheck && (
          <Pressable onPress={() => navigate('LoginOptions')}>
            <Text style={[styles.altLoginOptionText, {color: colors.link}]}>
              Login with a different Account.
            </Text>
          </Pressable>
        )}
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
    marginTop: deviceHeight * 0.22,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 18,
  },
  inputPasscodeContainer: {
    marginTop: 40,
  },
  seperatorText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  altLoginOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
});

export default Unlock;
