import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Shopkeeper} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../../../hooks/useTheme';

type ShopkeeperInfoProps = {
  shopkeeper: Shopkeeper;
};

const ShopkeeperInfo: React.FC<ShopkeeperInfoProps> = ({
  shopkeeper,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <LinearGradient
      colors={[
        currentTheme.baseColor,
        currentTheme.baseColor,
        // currentTheme.fadeColor,
        // currentTheme.bgColor,
      ]}
      style={[
        styles.ShopkeeperInfoContainer,
        {backgroundColor: currentTheme.fadeColor},
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  ShopkeeperInfoContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 10,
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

export default ShopkeeperInfo;
