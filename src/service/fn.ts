import {Alert, Platform, ToastAndroid} from 'react-native';
import Toast from 'react-native-toast-message';
import {v4 as uuidv4} from 'uuid';
import {User} from '../../types';
import Clipboard from '@react-native-clipboard/clipboard';
import Crypto from 'crypto-js';
import {CRYPTO_ENCRYPTION_KEY} from '@env';

export const BASE_SERVER_PORT = '10.33.11.12';

type ShowToastFunction = {
  type: 'success' | 'error' | 'info';
  text1: string;
  text2?: string;
  position?: 'bottom' | 'top';
  pressAction?: () => void;
};

export const showToast = ({
  type,
  text1,
  text2,
  position = 'bottom',
  pressAction = () => {},
}: ShowToastFunction) => {
  Toast.show({
    type,
    text1,
    text2,
    text1Style: {fontSize: 16},
    text2Style: {fontSize: 12},
    position: 'top',
    onPress: pressAction,
  });
};

export const hideToast = () => Toast.hide();

export const Confirm = async (
  title: string,
  context?: string,
): Promise<boolean> => {
  return new Promise(resolve => {
    Alert.alert(
      title,
      context && context,
      [
        {text: 'OK', onPress: () => resolve(true), style: 'default'},
        {text: 'CANCEL', onPress: () => resolve(false), style: 'cancel'},
      ],
      {cancelable: true},
    );
  });
};
export const randomId = () => uuidv4();

export const toogleState = (
  fn: (value: boolean) => void,
): {true: () => void; false: () => void} => {
  return {
    true: () => fn(true),
    false: () => fn(false),
  };
};
export const checkDate = ({
  date,
  matchByDay = 1,
}: {
  date: number;
  matchByDay?: number;
}) => {
  if (typeof date !== 'number') {
    return {
      isExactMatch: false,
      sameDay: false,
      thisMonth: false,
      lastMonth: false,
      twoMonthsOld: false,
      threeMonthsOld: false,
      fourMonthsOld: false,
      olderThanFourMonths: false,
      monthsOld: null,
      daysAgo: null,
    };
  }

  const parsedDate = new Date(date);
  const now = new Date();

  const nowUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const parsedDateUTC = new Date(
    Date.UTC(
      parsedDate.getUTCFullYear(),
      parsedDate.getUTCMonth(),
      parsedDate.getUTCDate(),
    ),
  );

  const timeDifference = nowUTC.getTime() - parsedDateUTC.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const monthDifference =
    (nowUTC.getFullYear() - parsedDateUTC.getFullYear()) * 12 +
    (nowUTC.getMonth() - parsedDateUTC.getMonth());

  return {
    isExactMatch: daysDifference === matchByDay - 1,
    sameDay: daysDifference === 0,
    thisMonth: monthDifference === 0,
    lastMonth: monthDifference === 1,
    twoMonthsOld: monthDifference === 2,
    threeMonthsOld: monthDifference === 3,
    fourMonthsOld: monthDifference === 4,
    olderThanFourMonths: monthDifference > 4,
    monthsOld: monthDifference,
    daysAgo: daysDifference,
  };
};

export const modifyUserName = (name: User['name']) => {
  const nameToArray = name.split(' ');
  const modifiedName = nameToArray
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return modifiedName;
};

export const validEmailRegex =
  /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/i;

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/i;
  return emailRegex.test(email.trim());
}

export const formatNumber = (
  x: string | number,
  opts?: {formated?: boolean},
): string => {
  if (Number.isNaN(x)) return '';
  if (opts && !opts.formated) {
    return x.toString();
  }
  const num = Number(x);
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (num >= 10_00_00_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 100_000) {
    return (num / 1_000).toFixed(0) + 'K';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
};

export const formatNumberWithComma = (x: string | number): string => {
  if (Number.isNaN(x)) return '';
  const num = Number(x);
  return num.toLocaleString('en-IN');
};

export const copyTextToClipboard = (text: string, notifyOnCopy = true) => {
  Clipboard.setString(text);
  if (!notifyOnCopy) return;
  if (Platform.OS === 'android') {
    ToastAndroid.show('Referral code copied!', ToastAndroid.SHORT);
  } else {
    Alert.alert('Copied', 'Referral code copied to clipboard!');
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    const kb = (bytes / 1024).toFixed(2);
    return `${kb} KB`;
  } else {
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  }
};
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300,
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit = 600,
) {
  let inThrottle: boolean;
  let lastArgs: Parameters<T> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

export const showValidationMessage = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('Validation Error', msg);
  }
};

export const compareStrings = (
  a: string,
  b: string,
  options?: { returnOnFail?: any },
) => {
  if (a.trim() === b.trim()) {
    return options?.returnOnFail;
  } else {
    return a.trim();
  }
};

export const compare = (
  a: string,
  b: string,
  options?: { returnOnFail?: any; datatype?: 'string' | 'number' | 'boolean' },
) => {
  const datatype = options?.datatype ?? 'string';

  switch (datatype) {
    case 'number': {
      const numA = Number(a);
      const numB = Number(b);
      if (Number.isNaN(numA) || Number.isNaN(numB)) return options?.returnOnFail;
      return numA === numB ? options?.returnOnFail : a;
    }

    case 'boolean': {
      const boolA = a === 'true' || a === '1';
      const boolB = b === 'true' || b === '1';
      return boolA === boolB ? options?.returnOnFail : a;
    }

    case 'string':
      return compareStrings(a, b, { returnOnFail: options?.returnOnFail });

    default:
      throw new Error(`ERROR_CODE: INVALID_DATA_TYPE; ${options?.datatype}`);
  }
};
export const onTruthy = (
  a?: boolean,
  fn?: () => void,
  options?: {returnOnFail?: any},
) => {
  if (a) {
    fn?.();
    return;
  }
  return options?.returnOnFail;
};

export const encrypt = (str: string): string | null => {
  if (!CRYPTO_ENCRYPTION_KEY) return null;
  return Crypto.AES.encrypt(str, CRYPTO_ENCRYPTION_KEY).toString();
};
export const decrypt = (encryptedUri: string): string | null => {
  if (!CRYPTO_ENCRYPTION_KEY) return null;
  const bytes = Crypto.AES.decrypt(encryptedUri, CRYPTO_ENCRYPTION_KEY);
  return bytes.toString(Crypto.enc.Utf8);
};
