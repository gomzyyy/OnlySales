import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {
  back,
  navigate,
  resetAndNavigate,
} from '../../../../utils/nagivationUtils';
import {deviceHeight} from '../../../../utils/Constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../store/store';
import {showToast} from '../../../../service/fn';
import {ValidateEmailOtpAPI} from '../../../../api/api.validate';
import {validateTokenAPI} from '../../../../api/api.auth';
import {setUser} from '../../../../../store/slices/business';

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [newOtpCountDown, setNewotpCountDown] = useState<number>(59);
  const [matched, setMatched] = useState<boolean>();

  const reqOtp = async () => {
    const data = {
      query: {
        uid: user._id,
        role: user.role,
      },
      body: {
        otp,
      },
    };
    const res = await ValidateEmailOtpAPI(data, setLoading);
    if (res.success) {
      const updatedUser = await validateTokenAPI({role: user.role});
      if (updatedUser.success && updatedUser.data.user) {
        dispatch(setUser(updatedUser.data.user));
        showToast({type: 'success', text1: res.message});
        setMatched(true);
        resetAndNavigate('Dashboard');
        return;
      }
    } else {
      showToast({type: 'error', text1: 'Please try requesting again.'});
      return;
    }
  };
  useEffect(() => {
    setNewotpCountDown(59);
    const intervalId = setInterval(() => {
      setNewotpCountDown(prev => {
        if (prev === 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text
          style={
            styles.headerTitle
          }>{`Enter the OTP sent to ${user.email?.value.slice(
          0,
          1,
        )}************`}</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={`Your OTP here.`}
              placeholderTextColor={currentTheme.baseColor}
              textAlign="center"
              cursorColor={'rgba(0,0,0,0)'}
              keyboardType="numeric"
              autoFocus
              secureTextEntry
              passwordRules={'digit'}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={reqOtp}
            disabled={loading}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              {loading ? 'Requesting' : 'Verify OTP'}
            </Text>
            {loading ? (
              <ActivityIndicator size={22} color={currentTheme.contrastColor} />
            ) : (
              <Icon
                name="rightcircle"
                size={22}
                color={currentTheme.contrastColor}
              />
            )}
          </TouchableOpacity>

          {!matched && newOtpCountDown !== 0 ? (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
              }}>{`Request a new OTP in: ${newOtpCountDown}s`}</Text>
          ) : (
            <Pressable
              style={{
                marginBottom: 10,
                alignItems: 'center',
                gap: 10,
                marginTop: 20,
              }}
              onPress={() => back()}>
              <Text
                style={[styles.reqNewOtpText, {color: currentTheme.baseColor}]}>
                Request a new OTP.
              </Text>
            </Pressable>
          )}
        </View>
        <View style={styles.bottomDescriptionContainer}>
          <Text style={styles.descriptionText}>
            Please check your Mail inbox for the One-Time Password.
          </Text>
        </View>
        <Pressable
          style={{
            marginBottom: 40,
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
            backgroundColor: currentTheme.baseColor,
            paddingVertical: 16,
            paddingHorizontal: 16,
            alignSelf: 'center',
            borderRadius: 20,
            flexDirection: 'row',
          }}
          onPress={() => resetAndNavigate('Dashboard')}>
          <Icon2
            name="chevron-back-circle-sharp"
            size={22}
            color={currentTheme.contrastColor}
          />
          <Text style={[styles.backText, {color: currentTheme.contrastColor}]}>
            Back to Dashboard
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.22,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  formContainer: {
    marginTop: 40,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
    marginTop: 20,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputText: {
    borderBottomWidth: 2,
    // borderLeftWidth: 2,
    // borderRadius: 8,
    height: 60,
    fontSize: 22,
    paddingHorizontal: 12,
  },
  proceedButton: {
    marginTop: 30,
    padding: 30,
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
  bottomDescriptionContainer: {
    marginTop: deviceHeight * 0.08,
    paddingHorizontal: 10,
    gap: 12,
    marginBottom: 20,
  },
  descriptionText: {fontSize: 18, textAlign: 'center'},
  reqNewOtpText: {fontSize: 16, textAlign: 'center'},
  backText: {fontSize: 26, textAlign: 'center'},
  descriptionseperationText: {fontSize: 22, textAlign: 'center'},
});

export default VerifyEmail;
