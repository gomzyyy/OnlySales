import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceHeight} from '../../../../utils/Constants';
import {navigate} from '../../../../utils/nagivationUtils';
import BusinessTypePicker from '../../../../components/BusinessTypePicker';
import {BusinessType} from '../../../../../enums';
import {useRoute} from '@react-navigation/native';
import {setShopkeeper} from '../../../../../store/slices/shopkeeper';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';
import {showToast} from '../../../../service/fn';

type AskAboutUserInfoParams = {
  name: string;
  userId: string;
};

const AskAboutUserInfo = () => {
  const {params} = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const {name, userId} = params as AskAboutUserInfoParams;
  const {currentTheme} = useTheme();
  const [businessType, setBusinessType] = useState<BusinessType>(
    BusinessType.RETAIL,
  );
  const [businessName, setBusinessName] = useState<string>('');

  const handleSetBusinessType = () => {
    if (!businessName || businessName.length === 0) {
      showToast({type: 'error', text1: 'Business name is required!'});
      return;
    } else if (businessName.length < 4 || businessName.length > 64) {
      showToast({
        type: 'error',
        text1: 'Business name should between 4-64 characters!',
      });
      return;
    }
    const signupData = {
      name,
      userId,
      businessName,
      businessType,
    };
    dispatch(setShopkeeper(signupData));
    navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView style={styles.parent}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.title}>Let's Talk about your business.</Text>
        <Text style={styles.subTitle}>
          Please let us know about your business.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your business name:</Text>
            <TextInput
              value={businessName}
              onChangeText={setBusinessName}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Your business name here."
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose your business type:</Text>
            <BusinessTypePicker
              enabled={true}
              value={businessType}
              setState={setBusinessType}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={handleSetBusinessType}>
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
  title: {
    fontSize: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.15,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.05,
  },
  formContainer: {
    marginTop: deviceHeight * 0.06,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
    marginTop: deviceHeight * 0.03,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 60,
    fontSize: 22,
    paddingHorizontal: 12,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  proceedButton: {
    marginTop: deviceHeight * 0.06,
    padding: 20,
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
});

export default AskAboutUserInfo;
