import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../../hooks/index';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceHeight} from '../../../../utils/Constants';
import {navigate} from '../../../../utils/nagivationUtils';
import {BusinessType} from '../../../../../enums';
import {useRoute} from '@react-navigation/native';
import {Image} from 'react-native';
import SlideUpContainer from '../../../../components/SlideUpContainer';
import FilePicker from '../../../../components/FilePicker';
const NoPhoto = require('../../../../assets/images/no-profile.jpg');

type GetUserSignupImageParams = {
  name: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  businessDiscription?: string | null;
  businessPhoneNumber: string;
  businessAddress: string;
  email: string;
  referralCode: string | undefined;
};

const GetUserSignupImage = () => {
  const {params} = useRoute();
  const {
    name,
    userId,
    businessPhoneNumber,
    businessAddress,
    businessName,
    businessType,
    email,
    referralCode,
    businessDiscription,
  } = params as GetUserSignupImageParams;
  const {currentTheme} = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);

  const handleNavigation = () => {
    const params = {
      name,
      userId,
      businessName,
      businessType,
      businessDiscription,
      businessPhoneNumber,
      businessAddress,
      email,
      referralCode,
      image,
    };
    navigate('SetPassword', params);
  };
  const cancelImagePicker = () => {
    setImage(undefined);
    setOpenImagePicker(false);
  };

  const closeImagePicker = () => {
    setOpenImagePicker(false);
  };

  const handleSkipIfImage = () => {
    setImage(undefined);
    const params = {
      name,
      userId,
      businessName,
      businessType,
      businessDiscription,
      businessPhoneNumber,
      businessAddress,
      email,
      referralCode,
      image: undefined,
    };
    navigate('SetPassword', params);
  };
  return (
    <KeyboardAvoidingView style={styles.parent}>
      {image && image.trim().length !== 0 && (
        <TouchableOpacity
          style={{position: 'absolute', right: 20, top: 20}}
          onPress={handleSkipIfImage}>
          <Text style={{fontSize: 18}}>Skip</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Let's set your Profile image.</Text>
        <Text style={styles.subTitle}>
          Click below to set or change profile image; you can skip this step.
        </Text>
        <View style={styles.formContainer}>
          <Pressable
            style={styles.imageContainer}
            onPress={() => setOpenImagePicker(true)}>
            <Image
              source={
                image && image.trim().length !== 0 ? {uri: image} : NoPhoto
              }
              style={{height: '100%', width: '100%'}}
            />
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.proceedButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={handleNavigation}>
            <Text
              style={[
                styles.proceedButtonText,
                {color: currentTheme.contrastColor},
              ]}>
              {image && image.trim().length !== 0 ? 'Continue' : 'Skip'}
            </Text>
            {loading ? (
              <ActivityIndicator size={18} color={currentTheme.contrastColor} />
            ) : (
              <Icon
                name="rightcircle"
                size={22}
                color={currentTheme.contrastColor}
              />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SlideUpContainer
        opacity={0.2}
        open={openImagePicker}
        close={cancelImagePicker}
        height={220}>
        <FilePicker
          value={image}
          setState={setImage}
          callback={closeImagePicker}
          type="image"
        />
      </SlideUpContainer>
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
    marginTop: deviceHeight * 0.18,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.05,
  },
  formContainer: {
    marginTop: deviceHeight * 0.04,
    gap: 16,
    alignItems: 'center',
  },
  imageContainer: {
    gap: 10,
    height: 200,
    width: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dotted',
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

export default GetUserSignupImage;
