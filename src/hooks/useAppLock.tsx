import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

type useAppLockProps = {
  key: [string, string, string, string];
};
type useAppLockReturnType = {
  ok: boolean;
};

const useAppLock = ({key}: useAppLockProps): useAppLockReturnType => {
  const unlockKey: [string, string, string, string] | undefined = useSelector(
    (s: RootState) => s.appData.BusinessOwner.accessPasscode,
  );
  const ok: boolean = JSON.stringify(unlockKey) === JSON.stringify(key);
  return {
    ok,
  };
};

export default useAppLock;
