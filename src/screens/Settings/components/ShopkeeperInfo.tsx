import {View, StyleSheet, Image} from 'react-native';
import React from 'react';
import {Shopkeeper} from '../../../../types';
const NoProfile = require('../../../assets/images/no-profile.jpg');
import {currentTheme} from '../../../utils/Constants';
import LinearGradient from 'react-native-linear-gradient';

type ShopkeeperInfoProps = {
  shopkeeper: Shopkeeper;
};

const ShopkeeperInfo: React.FC<ShopkeeperInfoProps> = ({
    shopkeeper,
}): React.JSX.Element => {
  return (
    <LinearGradient
      colors={[currentTheme.baseColor,currentTheme.fadeColor, currentTheme.bgColor]}
      style={styles.ShopkeeperInfoContainer}>
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
    backgroundColor: currentTheme.fadeColor,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
