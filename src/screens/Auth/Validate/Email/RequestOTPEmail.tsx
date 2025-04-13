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
import {back, navigate} from '../../../../utils/nagivationUtils';
import {deviceHeight} from '../../../../utils/Constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../store/store';
import {showToast} from '../../../../service/fn';
import {requestEmailOtpAPI} from '../../../../api/api.validate';

const RequestOTPEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [email, setEmail] = useState<string>(user.email?.value || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [newOtpCountDown, setNewotpCountDown] = useState<number>(59);

  const reqOtp = async () => {
    const data = {
      query: {
        uid: user._id,
        role: user.role,
      },
      body: {
        updatedEmail:
          email.trim() === user.email?.value ? undefined : email.trim(),
      },
    };
    const res = await requestEmailOtpAPI(data, setLoading);
    if (res.success) {
      setSent(true);
      setNewotpCountDown(59);
      showToast({type: 'success', text1: res.message});
      navigate('VerifyEmail');
      return;
    } else {
      showToast({type: 'error', text1: 'Please try requesting again.'});
      return;
    }
  };
  useEffect(() => {
    if (!sent) return;

    const intervalId = setInterval(() => {
      setNewotpCountDown(prev => {
        if (prev === 0) {
          setSent(false);
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [sent]);
  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>{`Hello ${user.name},`}</Text>
        <Text style={styles.subtitle}>
          please confirm your Email and click on proceed to get an OTP.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={`Your new Email`}
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={reqOtp}
            disabled={loading || sent}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              {sent ? 'Sent' : loading ? 'Requesting' : 'Request OTP'}
            </Text>
            {loading ? (
              <ActivityIndicator size={22} color={currentTheme.contrastColor} />
            ) : sent ? (
              <Icon2
                name="checkmark-circle-sharp"
                size={22}
                color={currentTheme.contrastColor}
              />
            ) : (
              <Icon
                name="rightcircle"
                size={22}
                color={currentTheme.contrastColor}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.bottomDescriptionContainer}>
          <Text style={styles.descriptionText}>
            You'll recieve an email with a 6-Digit One-Time Password. Please
            don't share any password or OTP with anyone as it can lead to
            Financial Frauds.
          </Text>
          <Pressable
            style={{
              marginBottom: 40,
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
            }}
            onPress={() => back()}>
            <Text style={[styles.backText, {color: currentTheme.baseColor}]}>
              Back
            </Text>
          </Pressable>
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
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.18,
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
  backText: {fontSize: 26, textAlign: 'center'},
  descriptionseperationText: {fontSize: 22, textAlign: 'center'},
});

export default RequestOTPEmail;
