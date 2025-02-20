import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Customer} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import {Theme} from '../../../utils/Constants';
const currentTheme = Theme[0];

type CustomerInfoProps = {
  customer: Customer;
};

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  customer,
}): React.JSX.Element => {
  return (
    <View style={styles.customerInfoContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  customerInfoContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: currentTheme.fadeColor,
    borderRadius:10
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    overflow: 'hidden',
    borderRadius: '50%',
    backgroundColor: 'red',
  },
  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'contain',
  },
});

export default CustomerInfo;
