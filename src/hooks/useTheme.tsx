import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {AppTheme} from '../../types';
import {Theme} from '../utils/Constants';

export interface useThemeReturnType {
  currentTheme: AppTheme;
}

const useTheme = (): useThemeReturnType => {
  const {currentTheme, defaultTheme} = useSelector(
    (s: RootState) => s.appData.app,
  );
  const fallback = Theme[2];
  return {
    currentTheme: currentTheme || defaultTheme || fallback,
  };
};

export default useTheme;
