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
import React, {useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../../utils/nagivationUtils';
import {deviceHeight} from '../../../../utils/Constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import {AdminRole} from '../../../../../enums';
import {loginAPI} from '../../../../api/api.auth';
import {setUser} from '../../../../../store/slices/business';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {showToast} from '../../../../service/fn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifyPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const {role, name, userId} = useRoute().params as {
    role: AdminRole;
    name: string;
    userId: string;
  };

  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const roleLabel = (s: 'c' | 's') => {
    return (
      (role === AdminRole.OWNER && (s === 'c' ? 'Owner' : 'owner')) ||
      (role === AdminRole.PARTNER && (s === 'c' ? 'Partner' : 'partner')) ||
      (role === AdminRole.EMPLOYEE && (s === 'c' ? 'Employee' : 'employee')) ||
      'user'
    );
  };
  const login = async () => {
    const res = await loginAPI({role, userId, password}, setLoading);
    if (res.success) {
      if (res.data && res.data.user && res.data.token) {
        await AsyncStorage.setItem('accessToken', res.data.token);
        dispatch(setUser(res.data.user));
        showToast({type: 'success', text1: res.message});
        navigate('Dashboard');
        return;
      } else {
        showToast({type: 'error', text1: 'Internal server error occured.'});
        return;
      }
    } else {
      showToast({type: 'error', text1: res.message});
      return;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.headerTitle}>
          {`Welcome Back ${name}! Your account was tightly secured by us.`}
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your password:</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={`${roleLabel('s')} Id`}
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={login}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              Proceed
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
        </View>
        <View style={styles.bottomDescriptionContainer}>
          <Text style={styles.descriptionText}>
            By Proceeding, App will check if you are our Existing user or not.
          </Text>
          <Text style={styles.descriptionseperationText}>or</Text>
          {role === AdminRole.OWNER ? (
            <Pressable
              style={{justifyContent: 'center', marginBottom: 40}}
              onPress={() => navigate('SignUp')}>
              <Text
                style={[
                  styles.descriptionText,
                  {color: currentTheme.baseColor},
                ]}>
                Signup to get owner ID.
              </Text>
            </Pressable>
          ) : (
            <Text
              style={[styles.descriptionText, {color: currentTheme.baseColor}]}>
              Request your Owner to let you in this App.
            </Text>
          )}
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
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.18,
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
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  descriptionText: {fontSize: 18, textAlign: 'center'},
  descriptionseperationText: {fontSize: 22, textAlign: 'center'},
});

export default VerifyPassword;
