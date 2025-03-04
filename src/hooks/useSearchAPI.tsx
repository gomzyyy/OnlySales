import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {AppTheme} from '../../types';

export interface useSearchAPIReturnType {
  currentTheme: AppTheme;
}
type useSearchAPIProps = {
  arr: any[];
  compareWith:string | number
};

const useSearchAPI = ({arr,compareWith}: useSearchAPIProps): useSearchAPIReturnType => {
  const {currentTheme, defaultTheme} = useSelector(
    (s: RootState) => s.shopkeeper.app,
  );
  return {
    currentTheme: currentTheme ?? defaultTheme,
  };
};

export default useSearchAPI;
