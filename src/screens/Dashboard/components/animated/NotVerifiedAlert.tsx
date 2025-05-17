import {View, Text, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../../../../hooks';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {navigate} from '../../../../utils/nagivationUtils';
import {colors} from '../../../../utils/Constants';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';

const NotVerifiedAlert = () => {
  const {currentTheme} = useTheme();
  const {t} = useTranslation('dashboard');
  const user = useSelector((s: RootState) => s.appData.user)!;
  const unverifiedAlertHeight = useSharedValue(0);
  const unverifiedAlertAnimatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(unverifiedAlertHeight.value, {duration: 200}),
    };
  });
  const closeUnverifiedAlert = () => (unverifiedAlertHeight.value = 0);

  useEffect(() => {
    let unverifiedAlertAnimatedStylesToogleTimeoutId: NodeJS.Timeout | null;
    if (user.email && !user.email.verified) {
      unverifiedAlertAnimatedStylesToogleTimeoutId = setTimeout(
        () => (unverifiedAlertHeight.value = 24),
        1500,
      );
    }
    return () => {
      unverifiedAlertAnimatedStylesToogleTimeoutId &&
        clearTimeout(unverifiedAlertAnimatedStylesToogleTimeoutId);
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: currentTheme.contrastColor,
          borderBottomRightRadius: 14,
          borderBottomLeftRadius: 14,
          marginBottom: 10,
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          position: 'static',
          top: 0,
          elevation: 10,
        },
        unverifiedAlertAnimatedStyles,
      ]}>
      <Text style={{fontSize: 14, color: colors.danger}}>
        {t('d_email_not_verified')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            unverifiedAlertHeight.value = 0;
            navigate('RequestOTPEmail');
          }}>
          <Text style={{fontSize: 14, color: currentTheme.baseColor}}>
            {t('d_email_not_verified_clicktoverify')}
          </Text>
        </Pressable>
        <Pressable
          style={{alignItems: 'center'}}
          onPress={closeUnverifiedAlert}>
          <Icon name="close" size={14} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default NotVerifiedAlert;
