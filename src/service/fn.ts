import {Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {v4 as uuidv4} from 'uuid';
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
    Alert.alert(title, context && context, [
      {text: 'OK', onPress: () => resolve(true), style: 'default'},
      {text: 'CANCEL', onPress: () => resolve(false), style: 'cancel'},
    ]);
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
export const checkDate = (date:number) => {
  if (typeof date !== 'number') {
    console.log('Invalid input');
    return {
      sameDay: false,
      thisMonth: false,
      lastMonth: false,
      twoMonthsOld: false,
  threeMonthsOld: false,
  fourMonthsOld: false,
  olderThanFourMonths: false,
      monthsOld: null,
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

  const monthDifference =
    (nowUTC.getFullYear() - parsedDateUTC.getFullYear()) * 12 +
    (nowUTC.getMonth() - parsedDateUTC.getMonth());

  const sameDay = nowUTC.getTime() === parsedDateUTC.getTime();

  return {
    sameDay,
    thisMonth: monthDifference === 0,
    lastMonth: monthDifference === 1,
    twoMonthsOld: monthDifference === 2,
  threeMonthsOld: monthDifference === 3,
  fourMonthsOld: monthDifference === 4,
  olderThanFourMonths: monthDifference > 4,
    monthsOld: monthDifference,
  };
};
