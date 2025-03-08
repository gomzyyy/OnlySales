import {View, StyleSheet, Image, Text} from 'react-native';
import React from 'react';
import {Shopkeeper} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import useTheme from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/AntDesign';

type ShopkeeperInfoProps = {
  shopkeeper: Shopkeeper;
  secure?:boolean
};

const ShopkeeperInfo: React.FC<ShopkeeperInfoProps> = ({
  shopkeeper,
  secure=false
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <View
      style={[
        styles.ShopkeeperInfoContainer,
      ]}>
      <View style={styles.profileImageContainer}>
        <Image
          source={
            shopkeeper.image && shopkeeper.image.trim().length !== 0
              ? {uri: shopkeeper.image}
              : NoProfile
          }
          style={styles.profileImage}
        />
      </View>
      <View style={styles.shopkeeperInfoContainer}>
        <Text style={styles.name}>{shopkeeper.name}</Text>
        <View style={styles.phoneNumberContainer}>
        <Icon name='mobile1' />
        <Text style={styles.phoneNumber}>: {shopkeeper.phoneNumber ? secure ? `+91-${shopkeeper.phoneNumber?.slice(0,5)}*****` : `+91-${shopkeeper.phoneNumber}` : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ShopkeeperInfoContainer: {
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: 'row',
    gap:10
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    overflow: 'hidden',
    borderRadius: '50%',
    backgroundColor: 'red',
    elevation:10
  },
  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'contain',
  },
  shopkeeperInfoContainer: {
    justifyContent:'center',
  gap:6
  },
  name: {
    fontSize: 30,
  },
  phoneNumberContainer:{
    flexDirection:'row',
    alignItems:'center'
  },
  phoneNumber:{fontSize: 16,textAlignVertical:'center'}
});

export default ShopkeeperInfo;
