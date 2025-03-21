import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Customer} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';

type CustomerInfoProps = {
  customer: Customer;
};

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  customer,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  
  return (
    <LinearGradient
      colors={[currentTheme.contrastColor, currentTheme.contrastColor]}
      style={[styles.customerInfoParent]}>
      <View style={styles.profileImageContainer}>
        <Image
          source={
            customer.image && customer.image.trim().length !== 0
              ? {uri: customer.image}
              : NoProfile
          }
          style={styles.profileImage}
        />
      </View>
      <View style={styles.customerInfoContainer}>
        <Text style={[styles.name, {color: currentTheme.baseColor}]}>
          {customer.name}
        </Text>
        <View style={styles.phoneNumberContainer}>
          <Icon name="mobile1" color={currentTheme.baseColor} />
          <Text style={[styles.phoneNumber, {color: currentTheme.baseColor}]}>
            {customer.phoneNumber ? `+91-${customer.phoneNumber}` : 'N/A'}
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Icon1 name="location-pin" size={16} color={currentTheme.baseColor} />
          <Text style={[styles.address, {color: currentTheme.baseColor}]}>
            {customer.address ? `${customer.address}` : 'N/A'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  customerInfoParent: {
    paddingVertical: 20,
    alignItems: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
  },

  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'cover',
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    overflow: 'hidden',
    borderRadius: '50%',
    backgroundColor: 'red',
  },
  customerInfoContainer: {
    justifyContent: 'center',
    gap: 6,
  },
  name: {
    fontSize: 30,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {fontSize: 16, textAlignVertical: 'center'},
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    textAlignVertical: 'center',
  },
});

export default CustomerInfo;
