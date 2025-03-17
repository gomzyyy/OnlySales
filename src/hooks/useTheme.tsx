import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {AppTheme} from '../../types';

export interface useThemeReturnType {currentTheme: AppTheme};

const useTheme = (): useThemeReturnType => {
  const {currentTheme, defaultTheme} = useSelector(
    (s: RootState) => s.appData.app,
  );
  return {
    currentTheme: currentTheme ?? defaultTheme,
  };
};

export default useTheme;
