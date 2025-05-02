import {useState, useCallback} from 'react';

type UseCacheReturnType = {
  get: (key: string) => any;
  set: (key: string, data: any) => void;
  clear: () => void;
  getAll: () => Record<string, any>;
};

const useCache = (): UseCacheReturnType => {
  const [cache, setCache] = useState<Record<string, any>>({});

  const get = useCallback((key: string) => cache[key], [cache]);

  const set = useCallback((key: string, data: any) => {
    setCache(prev => ({...prev, [key]: data}));
  }, []);

  const clear = useCallback(() => {
    setCache({});
  }, []);

  const getAll = useCallback(() => cache, [cache]);

  return {
    get,
    set,
    clear,
    getAll,
  };
};

export default useCache;
