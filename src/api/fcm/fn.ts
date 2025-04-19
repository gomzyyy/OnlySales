import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

export const getFCMToken = async () => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const fcmToken = await getToken(messaging);
    return fcmToken;
  } catch (error) {
    throw new Error(
      `${
        error instanceof Error
          ? error.message
          : 'Error occurred while getting FCM Token.'
      }`
    );
  }
};

