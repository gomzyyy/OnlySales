import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
} from 'react-native-permissions';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import {Confirm} from './fn';

export const RequestMediaPermissions = async (fallback?: () => void) => {
  const permissions =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.IOS.PHOTO_LIBRARY;
  const result = await check(permissions);
  if (result === RESULTS.GRANTED) return true;
  const requestPermission = await request(permissions);
  if (requestPermission === RESULTS.GRANTED) {
    return true;
  } else {
    fallback && fallback();
    return false;
  }
};
export const RequestCameraPermissions = async (fallback?: () => void) => {
  const permissions =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;
  const result = await check(permissions);
  if (result === RESULTS.GRANTED) return true;
  const requestPermission = await request(permissions);
  if (requestPermission === RESULTS.GRANTED) {
    return true;
  } else {
    fallback && fallback();
    return false;
  }
};

export const RequestNotificationPermission = async (fallback?: () => void) => {
  try {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          const res = await Confirm(
            'Notification Permission denied',
            'We need notification permissions to send you notifications for better user experience',
          );
          if (res) {
            openSettings('application');
          } else {
            fallback && fallback();
            return false;
          }
        }
      } catch (error) {
        fallback && fallback();
        return false;
      }
    }
    // const enabled =
    //   authStatus === AuthorizationStatus.AUTHORIZED ||
    //   authStatus === AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //   return true;
    // } else {
    //   fallback && fallback();
    //   return false;
    // }
  } catch (error) {
    fallback && fallback();
    return false;
  }
};
