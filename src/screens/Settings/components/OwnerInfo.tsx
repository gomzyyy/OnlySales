import {View, StyleSheet, Image, Text} from 'react-native';
import React from 'react';
import {BusinessOwner} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';

type OwnerInfoProps = {
  owner: BusinessOwner;
  secure?:boolean
};

const OwnerInfo: React.FC<OwnerInfoProps> = ({
  owner,
  secure=false
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <View
      style={[
        styles.ownerInfoParentContainer,
      ]}>
      <View style={styles.profileImageContainer}>
        <Image
          source={
            owner.image && owner.image.trim().length !== 0
              ? {uri: owner.image}
              : NoProfile
          }
          style={styles.profileImage}
        />
      </View>
      <View style={styles.ownerInfoContainer}>
        <Text style={styles.name}>{owner.name}</Text>
        <View style={styles.phoneNumberContainer}>
        <Icon name='mobile1' />
        <Text style={styles.phoneNumber}>: {owner.phoneNumber ? secure ? `+91-${owner.phoneNumber?.slice(0,5)}*****` : `+91-${owner.phoneNumber}` : 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ownerInfoParentContainer: {
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
  ownerInfoContainer: {
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

export default OwnerInfo;
