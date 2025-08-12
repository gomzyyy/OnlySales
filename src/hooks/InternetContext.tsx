import React, {createContext, useState, useEffect, useContext} from 'react';
import NetInfo from '@react-native-community/netinfo';

type InternetContextType = {
  isConnected: boolean;
};

const InternetContext = createContext<InternetContextType>({
  isConnected: true,
});

export const InternetProvider = ({children}: {children: React.ReactNode}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!(state.isConnected && state.isInternetReachable));
    });

    return () => unsubscribe();
  }, []);

  return (
    <InternetContext.Provider value={{isConnected}}>
      {children}
    </InternetContext.Provider>
  );
};

export const useInternet = () => useContext(InternetContext);
