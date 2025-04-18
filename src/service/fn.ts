import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {v4 as uuidv4} from 'uuid';
import {User} from '../../types';
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
    position,
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
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const parsedDateUTC = new Date(
    parsedDate.getUTCFullYear(),
    parsedDate.getUTCMonth(),
    parsedDate.getUTCDate(),
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

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (num >= 10_00_00_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // fallback for large numbers not in billions
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
