import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import RolePicker from '../../components/RolePicker';
import {AdminRole} from '../../../enums';
import {deviceHeight} from '../../utils/Constants';
import {navigate} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';

const GetStarted = () => {
  const {currentTheme}=useTheme()
  const [role, setRole] = useState<AdminRole>(AdminRole.OWNER);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let us know who you are!</Text>
      <Text style={styles.subtitle}>
        Choose Either you are a Employee or Business Owner
      </Text>
      <RolePicker value={role} setState={setRole} />
      <TouchableOpacity style={[styles.getStartedButton,{backgroundColor:currentTheme.baseColor}]}
      onPress={()=>navigate("Login",{role})}
      >
        <Text style={[styles.getStartedButtonText,{color:currentTheme.contrastColor}]}>Get Started</Text>
      </TouchableOpacity>
      <View style={styles.bottomDescriptionContainer}>
        <Text style={styles.descriptionText}>
          *Currently Our App is Limited to Business Owners. Please wait for the further
          Updates to use it as customer.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign:"center"
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  getStartedButton: {
    marginTop: deviceHeight * 0.08,
    padding: 25,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    alignSelf: 'center',
  },
  getStartedButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  bottomDescriptionContainer: {
    marginTop: deviceHeight * 0.05,
    paddingHorizontal: 10,
    gap: 12,
    position: 'absolute',
    bottom: deviceHeight * 0.06,
    alignSelf: 'center',
  },
  descriptionText: {fontSize: 12, textAlign: 'center'},
});

export default GetStarted;
