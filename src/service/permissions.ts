import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

export const RequestMediaPermissions = async () => {
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
    Alert.alert(
      'Media Permissions denied!',
      'You can change permissions in settings',
    );
    return false;
  }
};
export const RequestCameraPermissions = async () => {
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
    Alert.alert(
      'Camera Permissions denied!',
      'You can change permissions in settings',
    );
    return false;
  }
};
