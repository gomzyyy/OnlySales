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
export const checkDate = (date: string | number) => {
  // Ensure proper date conversion
  const parsedDate =
    typeof date === 'number'
      ? new Date(date) 
      : new Date(isNaN(Number(date)) ? date : Number(date));

  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid date:', date);
    return {
      sameDay: false,
      thisMonth: false,
      lastMonth: false,
      olderThanLastMonth: false,
      monthsOld: null,
    };
  }

  const now = new Date();
  const monthDifference =
    (now.getFullYear() - parsedDate.getFullYear()) * 12 +
    (now.getMonth() - parsedDate.getMonth());

  const sameDay =
    parsedDate.getFullYear() === now.getFullYear() &&
    parsedDate.getMonth() === now.getMonth() &&
    parsedDate.getDate() === now.getDate();

  return {
    sameDay,
    thisMonth: monthDifference === 0,
    lastMonth: monthDifference === 1,
    olderThanLastMonth: monthDifference > 1,
    monthsOld: monthDifference,
  };
};


