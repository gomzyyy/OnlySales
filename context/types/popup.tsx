//Enums defined at top

// Can prob to type annotations before reading the enums for better understanding. //

export enum PopupBehaviour {
  Alert = 'alert',
  Confirm = 'confirm',
  Prompt = 'prompt',
}

export enum PopupStates {
  Success = 'success',
  Error = 'error',
  Inform = 'inform',
}

export enum AlertLayout {
  Default = 'default',
  Expressive = 'expressive',
}


// Type annotations starts from here //

export interface PopupContextType {

  // Consume the alert Object's methods to use the Alert using usePopup hook; make sure the hook is used inside a JSX component that is wrapped with PopupProvider.

  alert: {

  // use open method to show alert and can pass multiple arguments to customise the Alert;

  open: (

  // title as first argument, it should be passed in the open method to show the title of Alert.

  title: string,

  // body as second argument, body is however optional but its recommended to pass to elaborate the title and Alert purpose.

  body?: string,

  // actions as third argument, to control the user actions; either agree or disagree as right side button or left side button respectively, an array of functions can be passed as third argument. Refer to the AlertActionsType type defination for more understanding.

  actions?: AlertActionsType,

  // opts or options as fourth and last argument, can pass options to control the Alert's behaviour and elements. Refer to the AlertOptions type defination for more understanding.

  opts?: AlertOptions

// open method returns void.

  ) => void;

  // use close method to simply close the Alert.

  // NOTE: close method is already well synced with the relevant wrapper which that relies on native methods to close the Alert smoothly. So there is no need to make any kind of changes to this method to make sure it closes the Alert with smooth a animation.

    close: () => void;

  // Context exposes the current state of Alert which can be further used anywhere.

    isVisible: boolean;
  };
}

  // Alert options can be passed to control the Alert. It gaves you the access to control display for the action buttons and Alert overall behavioud and UI that changes when valid valuers are passed through Alert's config

export type AlertOptions = {

// Use "agree" key to alter agree button configuration; can add more stuff into it for more control over the button 

  agree?: AlertAcceptButtonOptions;

 // Use "decline" key to alter decline button configuration; can add more stuff into it for more control over the button 

  decline?: AlertDeclineButtonOptions;

// Use "config" key to alter overall Alert configuration like Alert's behaviour, type and layout; can add more stuff into it for more control over the Alert

  config?: AlertConfig;
};

//                           INDIVIDUAL TYPE FOR CLEAN TYPE DEFINATION                               //


// Alert innter content type, can add more based on the Alert configuration. For now it holds the title and the body; short and long message respectively.

export type AlertContentType = { title: string; body: string };



// Alert actions: Pass an array of callbacks as the third argument in alert.open method to control the button press actions

//Usage: Alert actions can only have two callbacks; based on user agreement and declining, callback for user agreement, should be passed on the 0th index in the array and callback for user declining, should be passed to 1st index to make actions behave as expected.

export type AlertActionsType = [

  // Callback on user agreed [Right action button]:::Optional; Fallbacks to Native method if empty array is passed; it will simply close the Alert.

  (() => void | Promise<void>)?,

 // Callback on user denied [Left action button; disabled by default if the callback is not passed] WARNING: Pass a valid function that should return void to make it behave as expected.:::Optional; undefined by default; no fallback is provided, so handle it gracefully. Disagree button visibility depends upon if a valid callback is passed.

  (() => void | Promise<void>)?
];



// Type annotation for Alert action button configuration

export interface AlertActionButtonOptions{
  text: string 
}

// Explicit Type annotation for Alert action buttons that extends the 'AlertActionButtonOptions' to add button's specific configuration

export interface AlertAcceptButtonOptions extends AlertActionButtonOptions{};
export interface AlertDeclineButtonOptions extends AlertActionButtonOptions{};

// Alert configuration defination that controls the behaviour of Alert; see the default values in /context/PopupContext.tsx to know or change the default behaviour.

// NOTE: Use predefined enums to reduce typos.

export interface AlertConfig {

// behaviour defines the Alert behaviour as 'alert' or 'prompt' or 'confirm':::Default value: 'alert'
// NOTE: For now only 'alert' is added for now, can add more based on requirments.

  behaviour?: PopupBehaviour;

// type defines the state or status of Alert as 'success' or 'inform' or 'error'::: Default value: 'inform'

  type?: PopupStates;

// layout defines the overall layout of Alert, it can be 'default'; that looks like basic Alert, and 'expressive' that uses type value to express the Alert state

  layout?: AlertLayout;
  }
