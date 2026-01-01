import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react';
import { Alert, PopupContainerRef } from '../src/components/PopUp';
import {
  AlertActionsType,
  AlertContentType,
  AlertLayout,
  AlertOptions,
  PopupBehaviour,
  PopupContextType,
  PopupStates,
} from './types/popup';

// ****    "Please refer to the type annotations for clarity on usage [@/types/context/popupContext]"    **** //

// initial local states
const initialAlertOptions = {
  agree: { text: 'Ok' },
  decline: { text: 'Cancel' },
  config: {
    behaviour: PopupBehaviour.Alert,
    type: PopupStates.Inform,
    layout: AlertLayout.Default
  },
};

const initialAlertContent = {
  title: '',
  body: '',
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

const PopupProvider = ({ children }: PropsWithChildren) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [alertContent, setAlertContent] =
    useState<AlertContentType>(initialAlertContent);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>(
    initialAlertOptions
  );

  const closeNative = () => {
    if (popupRef.current) {
      popupRef.current.closeContainer();
    } else {
      console.warn('WARNING: Popup ref is not ready');
    }
  };

  const [alertActions, setAlertActions] = useState<AlertActionsType>([
    closeNative,
    undefined,
  ]);
  const [agreeing, setAgreeing] = useState<boolean>(false);
  const [declining, setDeclining] = useState<boolean>(false);
  const popupRef = useRef<PopupContainerRef>(null);

  const open = (
    title: string,
    body?: string,
    actions?: AlertActionsType,
    opts?: AlertOptions
  ) => {
    setAlertOptions(initialAlertOptions); // always reset the state to clear prev settings
    setAlertContent({ title, body: body ?? '' });
    setAlertActions(actions ?? [closeNative, undefined]); // always set new actions to make sure no prev action is triggered on press
    setIsVisible(true);
    if (opts) {
      setAlertOptions(opts);
    }
  };
  const closeAlert = () => {
    setAlertContent({ title: '', body: '' });
    setAlertActions([undefined, undefined]);
    setIsVisible(false); // reset everything when closed
  };

  const onAgree = async () => {
    setAgreeing(true);
    try {
      if (alertActions[0]) await alertActions[0](); // call action if provided
      closeNative();
    } catch (e) {
      return e;
    } finally {
      setAgreeing(false);
    }
  };
  const onDecline = async () => {
    setDeclining(true);
    try {
      if (alertActions[1]) await alertActions[1](); // call action if provided
      closeNative();
    } catch (e) {
      console.error(e);
    } finally {
      setDeclining(false);
    }
  };

  const context = {
    alert: {
      open,
      close: closeNative,
      isVisible,
    },
  };
  const alert_props = {
        open:isVisible,
        closeAlert:closeAlert,
        title:alertContent.title,
        body:alertContent.body,
        onAgree:onAgree,
        declineButton:(alertActions[1] !== undefined && typeof alertActions[1] === 'function'),
        onDecline:onDecline,
        loadingOnAgree:agreeing,
        loadingOnDecline:declining,
        alertOptions:alertOptions
  }
  return (
    <PopupContext.Provider value={context}>
      {children}
      <Alert ref={popupRef} {...alert_props}/>
    </PopupContext.Provider>
  );
};

export default PopupProvider;

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within an PopupProvider');
  }
  return context;
};