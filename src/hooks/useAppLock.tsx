import useAnalytics from './useAnalytics';

type useAppLockProps = {
  key: string;
};
type useAppLockReturnType = {
  ok: boolean;
};

const useAppLock = ({key}: useAppLockProps): useAppLockReturnType => {
  const {owner} = useAnalytics();
  const unlockKey: string | undefined = owner.accessPasscode;
  const ok: boolean = JSON.stringify(unlockKey) === JSON.stringify(key);
  return {
    ok,
  };
};

export default useAppLock;
