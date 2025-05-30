import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import {modifyUserName, showToast} from '../../../service/fn';
import {deviceHeight} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {ScrollView} from 'react-native-gesture-handler';
import {isNumber} from '../../../service/test';
import {Owner} from '../../../../types';
import {AdminRole} from '../../../../enums';
import { global } from '../../../styles/global';


const SignUp = () => {
  const {currentTheme} = useTheme();
  const prevUsers = useSelector((s: RootState) => s.appData.app.previousOwners);
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string>('');

  const handleCreateUser = () => {
    if (
      name.trim().length < 4 ||
      name.trim().length > 16 ||
      userId.trim().length < 4 ||
      userId.trim().length > 16
    ) {
      showToast({
        type: 'error',
        text1: 'Name and ID should between 4-16.',
        position: 'top',
      });
      return;
    }
    const user = prevUsers.find(s => s.userId === userId);
    if (user) {
      showToast({
        type: 'error',
        text1: 'This User ID has already Used, try with a different ID.',
      });
      return;
    }
    if (
      (businessPhoneNumber && businessPhoneNumber.trim().length < 10) ||
      (businessPhoneNumber && businessPhoneNumber.trim().length > 10) ||
      businessPhoneNumber.trim().length !== 10
    ) {
      showToast({
        type: 'error',
        text1: 'Please enter a valid Phone Number.',
      });
      return;
    }
    navigate('AskAboutUserInfo', {
      name,
      userId,
      businessPhoneNumber,
    });
  };

  const handlePhoneNumberChange = (val: string) => {
    const ok = isNumber(val);
    if (!ok) {
      showToast({
        type: 'error',
        text1: 'Invalid Input!',
        text2: 'This input only accept Numeric values.',
      });
      return;
    }
    setBusinessPhoneNumber(val);
  };

  return (
    <KeyboardAvoidingView
      style={styles.parent}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Welcome to Signup Page!.</Text>
        <Text style={styles.subTitle}>
          Please Add your credentials to Proceed.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your name:</Text>
            <TextInput
              value={name}
              onChangeText={value => {
                setName(modifyUserName(value));
              }}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Your name here."
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose a user Id:</Text>
            <TextInput
              value={userId}
              onChangeText={setUserId}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="user Id."
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Enter your Business Phone Number:
            </Text>
            <TextInput
              value={businessPhoneNumber || ''}
              onChangeText={value => handlePhoneNumberChange(value)}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="+91-"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={handleCreateUser}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              Next
            </Text>
            <Icon
              name="rightcircle"
              size={22}
              color={currentTheme.contrastColor}
            />
          </TouchableOpacity>
          <View style={styles.bottomDescriptionContainer}>
            <Text style={styles.descriptionText}>
              User Id can't be changed once created, please choose wisely.
            </Text>
            <Text style={styles.descriptionseperationText}>or</Text>
            <Pressable
              style={{justifyContent: 'center', marginBottom: 40}}
              onPress={() => navigate('Login', {role: AdminRole.OWNER})}>
              <Text
                style={[
                  styles.descriptionText,
                  {color: currentTheme.baseColor, fontWeight: 'bold'},
                ]}>
                Login
              </Text>
            </Pressable>
          </View>
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
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.1,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.09,
  },
  formContainer: {
    marginTop: deviceHeight * 0.04,
    gap: 10,
  },
  inputContainer: {
    gap: 10,
    marginTop: deviceHeight * 0.01,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 60,
    fontSize: 22,
    paddingHorizontal: 12,
  },
  proceedButton: {
    marginTop: deviceHeight * 0.02,
    padding: 25,
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
    marginTop: deviceHeight * 0.02,
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 30,
  },
  descriptionText: {fontSize: 18, textAlign: 'center'},
  descriptionseperationText: {fontSize: 22, textAlign: 'center'},
});

export default SignUp;
