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
type PermissionResult = {
  notification_permissions: boolean;
  write_contact_permissions: boolean;
  read_contact_permissions: boolean;
  fine_location_permissions: boolean;
};
export const RequestUXPermission = async (
  fallback?: () => void,
): Promise<PermissionResult> => {
  if (Platform.OS !== 'android') {
    return {
      notification_permissions: false,
      write_contact_permissions: false,
      read_contact_permissions: false,
      fine_location_permissions: false,
    };
  }

  try {
    const permissions = {
      'android.permission.POST_NOTIFICATIONS': {
        key: 'notification_permissions',
        title: 'Notification Permission Required',
        message:
          'We need notification access to keep you informed. Please enable it in settings.',
      },
      'android.permission.WRITE_CONTACTS': {
        key: 'write_contact_permissions',
        title: 'Contact Permission Required',
        message:
          'We need contact access to enhance your experience. Please enable it in settings.',
      },
      'android.permission.READ_CONTACTS': {
        key: 'read_contact_permissions',
        title: 'Contact Permission Required',
        message:
          'We need contact access to enhance your experience. Please enable it in settings.',
      },
      'android.permission.ACCESS_FINE_LOCATION': {
        key: 'fine_location_permissions',
        title: 'Location Permission Required',
        message:
          'We need location access to provide better recommendations. Please enable it in settings.',
      },
    };

    const requestKeys = Object.keys(permissions) as Array<keyof typeof permissions>;
    const res = await PermissionsAndroid.requestMultiple(requestKeys);

    const results: Record<string, boolean> = {};

    for (const perm of requestKeys) {
      const key = permissions[perm].key;
      const result = res[perm];

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        results[key] = true;
      } else {
        results[key] = false;

        let message = permissions[perm].message;
        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          message +=
            '\n\nYou have permanently denied this permission. Please enable it from settings.';
        }

        const userRes = await Confirm(permissions[perm].title, message);
        if (userRes) {
          await openSettings('application');
        }
      }
    }

    return {
      notification_permissions: results.notification_permissions || false,
      write_contact_permissions: results.write_contact_permissions || false,
      read_contact_permissions: results.read_contact_permissions || false,
      fine_location_permissions: results.fine_location_permissions || false,
    };
  } catch (error) {
    console.error('Permission request failed:', error);
    if (fallback) fallback();
    return {
      notification_permissions: false,
      write_contact_permissions: false,
      read_contact_permissions: false,
      fine_location_permissions: false,
    };
  }
};

