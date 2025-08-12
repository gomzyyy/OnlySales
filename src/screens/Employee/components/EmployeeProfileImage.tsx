import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/Feather';
const NoProfile = require('../../../assets/images/no-profile.jpg');

type EmployeeProfileImageProps = {
  image?: string;
  onImagePress: () => void;
  onChooseImagePress: () => void;
  onRemovePress: () => void;
};

const EmployeeProfileImage: React.FC<EmployeeProfileImageProps> = ({
  image,
  onChooseImagePress,
  onImagePress,
  onRemovePress,
}) => {
  const hasImage = !!image && image.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={onImagePress} style={styles.imageWrapper}>
        <Image
          source={hasImage ? {uri: image} : NoProfile}
          style={styles.profileImage}
        />
        <View style={styles.overlayIcon}>
          <Icon name="camera" size={20} color="#fff" />
        </View>
      </Pressable>

      {hasImage ? (
        <View style={styles.imageDetails}>
          <Text style={styles.imageName}>{`${image.slice(0, 30)}...`}</Text>
          <Pressable onPress={onRemovePress} style={styles.removeBtn}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={onChooseImagePress} style={styles.chooseBtn}>
          <Text style={styles.chooseText}>Choose Profile Image</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imageWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  overlayIcon: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 4,
  },
  imageDetails: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageName: {
    fontSize: 13,
    color: '#555',
    maxWidth: 160,
  },
  removeBtn: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.dangerFade,
    borderRadius: 6,
  },
  removeText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 12,
  },
  chooseBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.oliveGreen,
    borderRadius: 8,
  },
  chooseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EmployeeProfileImage;
