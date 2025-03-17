import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {deviceHeight} from '../../../utils/Constants';
import {hideToast, showToast} from '../../../service/fn';
import {ScrollView} from 'react-native-gesture-handler';

const Login = () => {
  const {currentTheme} = useTheme();
  const [userId, setUserId] = useState<string>('');

  const prevUsers = useSelector(
    (s: RootState) => s.appData.app.previousOwners,
  );
  const findFromPrevUsers = () => {
    if (userId.trim().length === 0) {
      showToast({
        type: 'error',
        text1: 'User Id cannot be empty.',
        position: 'top',
      });
      return;
    }
    const user = prevUsers.find(s => s.userId === userId);
    if (!user) {
      showToast({
        type: 'error',
        text1: 'No User found with this ID, Press to Create one.',
        position: 'top',
        pressAction: () => {
          navigate('SignUp');
          hideToast();
        },
      });
      return;
    }
    if (user.accessPasscode) {
      navigate('Unlock', {user,navigateTo:'LoginOptions'});
      return;
    } else {
      navigate('UserFound', {user});
      return;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.headerTitle}>
          Welcome Back! Please Login by user ID to Get Started.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your user Id:</Text>
            <TextInput
              value={userId}
              onChangeText={setUserId}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="user Id"
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={findFromPrevUsers}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              Proceed
            </Text>
            <Icon
              name="rightcircle"
              size={22}
              color={currentTheme.contrastColor}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomDescriptionContainer}>
          <Text style={styles.descriptionText}>
            By Proceeding, App will check if you are our Existing user or not.
          </Text>
          <Text style={styles.descriptionseperationText}>or</Text>
          <Pressable
            style={{justifyContent: 'center',marginBottom:40}}
            onPress={() => navigate('SignUp')}>
            <Text
              style={[styles.descriptionText, {color: currentTheme.baseColor}]}>
              Signup to get user ID.
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
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 180,
  },
  formContainer: {
    marginTop: 40,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
    marginTop: 40,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 24,
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
    marginTop: 40,
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
    marginTop: deviceHeight * 0.1,
    paddingHorizontal: 20,
    gap: 12,
  },
  descriptionText: {fontSize: 18, textAlign: 'center'},
  descriptionseperationText: {fontSize: 22, textAlign: 'center'},
});

export default Login;
