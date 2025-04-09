import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Owner} from '../../types';

type useAppLockProps = {
  key: [string, string, string, string];
};
type useAppLockReturnType = {
  ok: boolean;
};

const useAppLock = ({key}: useAppLockProps): useAppLockReturnType => {
  const owner = useSelector((s: RootState) => s.appData.user as Owner);
  const unlockKey: [string, string, string, string] | undefined =
    owner.accessPasscode;
  const ok: boolean = JSON.stringify(unlockKey) === JSON.stringify(key);
  return {
    ok,
  };
};

export default useAppLock;
