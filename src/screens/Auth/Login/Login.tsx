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
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import {deviceHeight} from '../../../utils/Constants';
import {showToast} from '../../../service/fn';
import {ScrollView} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import {AdminRole} from '../../../../enums';
import RolePicker from '../../../components/RolePicker';
import {findUserAPI} from '../../../api/api.auth';

const Login = () => {
  const {currentTheme} = useTheme();
  const {role} = useRoute().params as {role: AdminRole};

  const [userId, setUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>(
    role || AdminRole.OWNER,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const roleLabel = (s: 'c' | 's') => {
    return (
      (selectedRole === AdminRole.OWNER && (s === 'c' ? 'Owner' : 'owner')) ||
      (selectedRole === AdminRole.PARTNER &&
        (s === 'c' ? 'Partner' : 'partner')) ||
      (selectedRole === AdminRole.EMPLOYEE &&
        (s === 'c' ? 'Employee' : 'employee')) ||
      'user'
    );
  };
  const findFromPrevUsers = async () => {
    if (userId.trim().length < 4 || userId.trim().length > 16) {
      showToast({
        type: 'error',
        text1: 'User ID should between 4-16 characters',
      });
      return;
    }
    const res = await findUserAPI({userId, role}, setLoading);
    if (res.success) {
      navigate('VerifyPassword', {
        name: res.data.name,
        role: res.data.role,
        userId,
      });
      return;
    } else {
      showToast({
        type: 'info',
        text1: `No user found by ${userId}`,
      });
      return;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>
          {`Welcome Back! Please Login by ${roleLabel('c')} ID to Get Started.`}
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose your role:</Text>
            <RolePicker
              value={selectedRole}
              setState={setSelectedRole}
              enabled
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{`Enter your ${roleLabel(
              's',
            )} Id:`}</Text>
            <TextInput
              value={userId}
              onChangeText={setUserId}
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
            onPress={findFromPrevUsers}>
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
          {selectedRole === AdminRole.OWNER ? (
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
    fontSize: 30,
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

export default Login;
