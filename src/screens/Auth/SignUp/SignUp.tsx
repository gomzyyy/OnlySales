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
import {showToast} from '../../../service/fn';
import {deviceHeight} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {setShopkeeper} from '../../../../store/slices/shopkeeper';
import {ScrollView} from 'react-native-gesture-handler';
import {isNumber} from '../../../service/test';

const SignUp = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const prevUsers = useSelector(
    (s: RootState) => s.shopkeeper.app.previousShopkeepers,
  );
  const [name, setName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

  const handleCreateUser = () => {
    if (
      name.trim().length < 4 ||
      name.trim().length > 16 ||
      userId.trim().length < 4 ||
      userId.trim().length > 16
    ) {
      showToast({
        type: 'error',
        text1: 'Name and ID should between 4-16!',
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
      (phoneNumber && phoneNumber.trim().length < 10) ||
      (phoneNumber && phoneNumber.trim().length > 10)
    ) {
      showToast({
        type: 'error',
        text1: 'Please enter a valid Phone Number!',
      });
      return;
    }
    navigate('AskAboutUserInfo', {name, userId});
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
    setPhoneNumber(val);
  };

  return (
    <KeyboardAvoidingView
      style={styles.parent}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.headerTitle}>Welcome to Signup Page!.</Text>
        <Text style={styles.subTitle}>
          Please Add your credientials to Proceed.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your name:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
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
              Enter your Phone Number {'(optional)'}:
            </Text>
            <TextInput
              value={phoneNumber?.toString() || ''}
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
              style={{justifyContent: 'center',marginBottom:40}}
              onPress={() => navigate('Login')}>
              <Text
                style={[
                  styles.descriptionText,
                  {color: 'blue', fontWeight: 'bold'},
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
    marginTop: deviceHeight * 0.1,
  },
  formContainer: {
    marginTop: deviceHeight * 0.02,
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
