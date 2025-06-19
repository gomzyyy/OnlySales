import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Button } from 'react-native';
const NoProfile = require('../../../assets/images/no-profile.jpg');

type EmployeeProfileImageProps={
    image?:string;
    onImagePress:()=>void;
    onChooseImagePress:()=>void;
    onRemovePress:()=>void;
}

const EmployeeProfileImage:React.FC<EmployeeProfileImageProps> = ({image,onChooseImagePress,onImagePress,onRemovePress}) => {
  return (
   <>
          <Pressable
            style={styles.profileImageContainer}
            onPress={onImagePress}>
            <Image
              source={
                image && image.trim().length !== 0 ? {uri: image} : NoProfile
              }
              style={styles.profileImage}
            />
          </Pressable>

          {image && image.trim().length !== 0 ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{flex: 1}}>{`${image.slice(0, 40)}...`}</Text>
              <Button title="Remove" onPress={onRemovePress} />
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 40,
                alignItems: 'center',
              }}>
              <Button
                title="Choose Profile Image"
                onPress={onChooseImagePress}
              />
            </View>
          )}
   </>
  )
}

const styles = StyleSheet.create({
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
});


export default EmployeeProfileImage