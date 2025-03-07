import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import useTheme from '../../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceHeight} from '../../../../utils/Constants';
import {
  back,
  navigate,
  resetAndNavigate,
} from '../../../../utils/nagivationUtils';
import BusinessTypePicker from '../../../../components/BusinessTypePicker';
import {BusinessType} from '../../../../../enums';
import {useRoute} from '@react-navigation/native';
import {setShopkeeper} from '../../../../../store/slices/shopkeeper';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../../store/store';

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

  const handleSetBusinessType = () => {
    dispatch(setShopkeeper({name, userId, businessType}));
    navigate('Dashboard');
  };

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>Let's Talk about your business.</Text>
      <Text style={styles.subTitle}>
        Please let us know What type of business do you own?
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
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
    </View>
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
    marginTop: deviceHeight * 0.25,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.09,
  },
  formContainer: {
    marginTop: deviceHeight * 0.06,
    gap: 16,
  },
  inputContainer: {
    gap: 10,
    marginTop: deviceHeight * 0.01,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
