import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {AppTheme} from '../../types';

type useThemeReturnType = {currentTheme: AppTheme};

const useTheme = (): useThemeReturnType => {
  const {currentTheme, defaultTheme} = useSelector(
    (s: RootState) => s.shopkeeper.app,
  );
  return {
    currentTheme: currentTheme ?? defaultTheme,
  };
};

export default useTheme;
