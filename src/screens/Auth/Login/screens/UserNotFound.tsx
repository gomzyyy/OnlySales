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
import { deviceHeight } from '../../../../utils/Constants';
import { back, navigate, resetAndNavigate } from '../../../../utils/nagivationUtils';

const UserNotFound = () => {
  const {currentTheme} = useTheme();
  const [name, setName] = useState<string>('');

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>No User Found by your given userID!</Text>
      <Text style={styles.subTitle}>
        Please go back and retry with a different ID or Signup to get a new user
        ID.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.proceedButton,
            {backgroundColor: currentTheme.baseColor},
          ]}
          onPress={()=>back()}
          >
          <Icon
            name="leftcircle"
            size={22}
            color={currentTheme.contrastColor}
          />
          <Text
            style={[
              styles.proceedButtonText,
              {color: currentTheme.contrastColor},
            ]}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.proceedButton,
            {backgroundColor: currentTheme.baseColor},
          ]}
          onPress={()=>resetAndNavigate("SignUp")}
          >
          <Text
            style={[
              styles.proceedButtonText,
              {color: currentTheme.contrastColor},
            ]}>
            Signup
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
    marginTop: deviceHeight*0.25,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight*0.12,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  proceedButton: {
    marginTop: deviceHeight*0.06,
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

export default UserNotFound;
