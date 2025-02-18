import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

const prepareNavigation = () => navigationRef.isReady();

const navigate = (routeName: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  }
};
const replace = (routeName: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  }
};
const resetAndNavigate = (routeName: string, i?: number) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: i ?? 0,
        routes: [{name: routeName}],
      }),
    );
  }
};
const back = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
};

export {prepareNavigation, navigate, resetAndNavigate, replace, back};
