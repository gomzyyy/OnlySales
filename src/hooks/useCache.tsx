import {useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../store/store';
import {
  addOne,
  clear as c,
  reset as r,
  deleteExpired,
} from '../../store/slices/cache';

type UseCacheReturnType = {
  get: (key: string) => any;
  set: (key: string, data: any) => void;
  clear: () => void;
  getAll: () => any;
  reset: () => void;
  length: number;
  size: (type?: 'kb' | 'mb' | 'gb') => number;
  getRaw: Record<string, {data: any; timestamps: number}>;
};

const convertFileSizeType = (
  sizeInBytes: number,
  type: 'kb' | 'mb' | 'gb' = 'kb',
) => {
  const sizeObj = {
    kb: 1024,
    mb: 1024 ** 2,
    gb: 1024 ** 3,
  };
  return Number((sizeInBytes / sizeObj[type]).toFixed(2));
};

const useCache = (): UseCacheReturnType => {
  const d = useDispatch<AppDispatch>();
  const {cache, expiresIn} = useSelector((s: RootState) => s.cache);

  const get = useCallback(
    (key: string) => {
      d(deleteExpired());
      return cache[key]?.data ?? null;
    },
    [cache, d],
  );

  const set = useCallback(
    (key: string, data: any) => {
      d(deleteExpired());
      d(addOne({key, data}));
    },
    [d],
  );

  const getAll = useCallback(() => {
    d(deleteExpired());
    return Object.values(cache).filter(
      (entry: any) => entry?.timestamps > Date.now() - 1000 * 60 * expiresIn,
    );
  }, [cache, expiresIn, d]);

  const clear = useCallback(() => d(c()), [d]);
  const reset = useCallback(() => d(r()), [d]);

  const length = useMemo(() => Object.keys(cache).length, [cache]);
  const size = useCallback(
    (type: 'kb' | 'mb' | 'gb' = 'kb') => {
      const sizeInBytes = new Blob([JSON.stringify(Object.values(cache))]).size;
      return convertFileSizeType(sizeInBytes, type);
    },
    [cache],
  );
  return {
    get,
    set,
    clear,
    getAll,
    reset,
    length,
    size,
    getRaw: cache,
  };
};

export default useCache;
