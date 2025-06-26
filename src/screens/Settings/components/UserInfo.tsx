import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {Employee, Owner, Partner} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import {useTheme} from '../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import FilePicker from '../../../components/FilePicker';
import SlideUpContainer from '../../../components/SlideUpContainer';
import LinearGradient from 'react-native-linear-gradient';

type UserInfoProps = {
  user: Employee | Owner | Partner;
  secure?: boolean;
  profileImageValue?: string | undefined;
  setProfileImageValue?: Dispatch<SetStateAction<string | undefined>>;
};

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  secure = false,
  profileImageValue,
  setProfileImageValue = () => {},
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);
  const handleCloseImagePicker = () => setOpenImagePicker(false);
  const handleOpenImagePicker = () => {
    if (secure) return;
    setOpenImagePicker(true);
  };

  return (
    <LinearGradient
      colors={[currentTheme.fadeColor, '#fff']}
      start={{x: 0, y: 0}}
      style={[
        styles.userInfoParentContainer,
        {borderLeftColor: currentTheme.baseColor, borderLeftWidth: 2},
      ]}>
      <Pressable
        style={styles.profileImageContainer}
        onPress={handleOpenImagePicker}>
        <Image
          source={
            profileImageValue && profileImageValue.trim().length !== 0
              ? {uri: profileImageValue}
              : NoProfile
          }
          style={[styles.profileImage, {borderColor: currentTheme.baseColor}]}
        />
      </Pressable>
      <View style={styles.userInfoContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
          <Text style={[styles.name, {color: currentTheme.baseColor}]}>
            {user.name}
          </Text>
          {user.email?.verified && (
            <View>
              <Icon2
                name="verified-user"
                size={16}
                color={currentTheme.baseColor}
              />
            </View>
          )}
        </View>
        {user.phoneNumber?.value && (
          <View style={styles.phoneNumberContainer}>
            <Icon name="mobile1" color={currentTheme.baseColor} size={12} />
            <Text style={[styles.phoneNumber, {color: currentTheme.baseColor}]}>
              :{' '}
              {secure
                ? `+91-${user.phoneNumber.value.slice(0, 5)}*****`
                : `+91-${user.phoneNumber.value}`}
            </Text>
          </View>
        )}
        {user.email?.value && (
          <View style={styles.emailContainer}>
            <Icon name="mail" color={currentTheme.baseColor} size={12} />
            <Text
              ellipsizeMode="tail"
              style={[styles.email, {color: currentTheme.baseColor}]}>
              :{' '}
              {secure
                ? `${user.email.value.slice(0, 3)}***@***.${
                    user.email.value.split('.')[
                      user.email.value.split('.').length - 1
                    ]
                  }`
                : user.email.value}
            </Text>
          </View>
        )}
        {user.address && (
          <View style={styles.addressContainer}>
            <Icon1
              name="location-pin"
              color={currentTheme.baseColor}
              size={12}
            />
            <Text style={[styles.address, {color: currentTheme.baseColor}]}>
              : {user.address}
            </Text>
          </View>
        )}
      </View>
      <SlideUpContainer
        open={openImagePicker}
        close={handleCloseImagePicker}
        opacity={0.2}
        height={220}>
        <FilePicker
          value={profileImageValue}
          setState={setProfileImageValue}
          callback={handleCloseImagePicker}
          type="photo"
        />
      </SlideUpContainer>
      <View
        style={{
          backgroundColor: currentTheme.baseColor,
          position: 'absolute',
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 6,
          right: 10,
          top: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: currentTheme.contrastColor,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: '600',
            paddingVertical: 1,
            paddingHorizontal: 3,
          }}>
          {user.role}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  userInfoParentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 10,
  },
  profileImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 45,
  },
  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'cover',
    borderRadius: 45,
  },
  userInfoContainer: {
    justifyContent: 'center',
    gap: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 16,
    textAlignVertical: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,
  },
  email: {
    fontSize: 14,
    textAlignVertical: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    textAlignVertical: 'center',
  },
});

export default UserInfo;
