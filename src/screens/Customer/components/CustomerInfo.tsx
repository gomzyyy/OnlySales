import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Customer} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';
import SlideUpContainer from '../../../components/SlideUpContainer';
import EditCustomer from '../../../components/EditCustomer';
import {deviceHeight} from '../../../utils/Constants';

type CustomerInfoProps = {
  customer: Customer;
};

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  customer,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {t} = useTranslation('customer');
  const [profileImage, setProfileImage] = useState<string | undefined>(
    customer.image,
  );
  const [triggerEdit, setTriggerEdit] = useState<boolean>(false);

  const handleOpenTriggerEdit = () => setTriggerEdit(true);
  const handleCloseTriggerEdit = () => setTriggerEdit(false);

  return (
    <LinearGradient
      colors={[currentTheme.fadeColor, '#fff']}
      start={{x: 0, y: 0}}
      style={[
        styles.customerInfoParent,
        {borderLeftColor: currentTheme.baseColor, borderLeftWidth: 2},
      ]}>
      <Pressable
        style={[
          styles.profileImageContainer,
          {borderColor: currentTheme.baseColor},
        ]}>
        <Image
          source={
            profileImage && profileImage.trim().length !== 0
              ? {uri: profileImage}
              : NoProfile
          }
          style={styles.profileImage}
        />
      </Pressable>
      <TouchableOpacity
        activeOpacity={0.4}
        style={styles.customerInfoContainer}
        onPress={handleOpenTriggerEdit}>
        <Text style={[styles.name, {color: currentTheme.baseColor}]}>
          {customer.name}
        </Text>
        <View style={styles.phoneNumberContainer}>
          <Icon name="mobile1" color={currentTheme.baseColor} />
          <Text style={[styles.phoneNumber, {color: currentTheme.baseColor}]}>
            {customer.phoneNumber
              ? `+91-${customer.phoneNumber}`
              : t('c_customerinfo_nophonenumber')}
          </Text>
        </View>
        <View style={styles.addressContainer}>
          <Icon1 name="location-pin" size={16} color={currentTheme.baseColor} />
          <Text style={[styles.address, {color: currentTheme.baseColor}]}>
            {customer.address
              ? `${customer.address}`
              : t('c_customerinfo_nolocation')}
          </Text>
        </View>
      </TouchableOpacity>
      <SlideUpContainer
        height={deviceHeight * 0.52}
        open={triggerEdit}
        close={handleCloseTriggerEdit}>
        <EditCustomer i={customer} close={handleCloseTriggerEdit} />
      </SlideUpContainer>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  customerInfoParent: {
    paddingVertical: 20,
    alignItems: 'flex-start',
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
    borderRadius: '40%',
    borderWidth: 2,
  },
  customerInfoContainer: {
    justifyContent: 'center',
    gap: 6,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
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
