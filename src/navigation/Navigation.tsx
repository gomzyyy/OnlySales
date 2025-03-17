import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../screens/Dashboard/Dashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MenuContent from '../components/sub-components/MenuContent';
import Settings from '../screens/Settings/Settings';
import {navigationRef} from '../utils/nagivationUtils';
import Customer from '../screens/Customer/Customer';
import UnpaidUdhars from '../screens/Customer/screens/UnpaidUdhars';
import MyInventory from '../screens/MyInventory/MyInventory';
import SearchCustomer from '../screens/SearchCustomer/SearchCustomer';
import SearchEmployee from '../screens/SearchEmpolyee/SearchEmployee';
import PaidUdhars from '../screens/Customer/screens/PaidUdhars';
import MyProfile from '../screens/Settings/screens/MyProfile';
import Login from '../screens/Auth/Login/Login';
import SignUp from '../screens/Auth/SignUp/SignUp';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import UserNotFound from '../screens/Auth/Login/screens/UserNotFound';
import AskAboutUserInfo from '../screens/Auth/SignUp/screens/AskAboutUserInfo';
import UserFound from '../screens/Auth/Login/screens/UserFound';
import GetStarted from '../screens/SplashScreen/GetStarted';
import SetPasscode from '../screens/Auth/AppLock/SetPasscode/SetPasscode';
import Unlock from '../screens/Auth/AppLock/Unlock/Unlock';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {toogleLockApp} from '../../store/slices/business';
import {AppState} from 'react-native';
import LoginOptions from '../screens/Auth/LoginOptions/LoginOptions';
import ChangeTheme from '../screens/Settings/screens/ChangeTheme';
import {useTheme} from '../hooks/index';
import Customers from '../screens/Customers/Customers';
import Test from '../screens/Test/Test';
import SignupSuccess from '../screens/Auth/SignUp/screens/SignupSuccess';
import Analytics from '../screens/Analytics/Analytics';
import Employees from '../screens/Employees/Employees';
import Employee from '../screens/Employee/Employee';

const stack = createNativeStackNavigator();
const drawer = createDrawerNavigator();

const StackNav = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {accessPasscode} = useSelector(
    (s: RootState) => s.appData.BusinessOwner,
  );
  const {appLocked} = useSelector((s: RootState) => s.appData.app);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (
        nextAppState === 'background' ||
        (nextAppState === 'inactive' &&
          accessPasscode &&
          Array.isArray(accessPasscode))
      ) {
        dispatch(toogleLockApp(true));
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [appLocked, accessPasscode, dispatch]);
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: currentTheme.baseColor,
      }}>
      {/* <stack.Screen name="Test" component={Test} /> */}
      <stack.Screen name="SplashScreen" component={SplashScreen} />
      <stack.Screen name="Dashboard" component={Dashboard} />
      <stack.Screen name="Settings" component={Settings} />
      <stack.Screen name="Customer" component={Customer} />
      <stack.Screen name="SearchCustomer" component={SearchCustomer} />
      <stack.Screen name="Customers" component={Customers} />
      <stack.Screen name="Analytics" component={Analytics} />
      <stack.Screen name="Employees" component={Employees} />
      <stack.Screen name="SearchEmployee" component={SearchEmployee} />
      <stack.Screen name="UnpaidUdhars" component={UnpaidUdhars} />
      <stack.Screen name="PaidUdhars" component={PaidUdhars} />
      <stack.Screen name="MyInventory" component={MyInventory} />
      <stack.Screen name="MyProfile" component={MyProfile} />
      <stack.Screen name="GetStarted" component={GetStarted} />
      <stack.Screen
        name="Login"
        options={{gestureEnabled: false}}
        component={Login}
      />
      <stack.Screen
        name="SignUp"
        options={{gestureEnabled: false}}
        component={SignUp}
      />
      <stack.Screen
        name="UserNotFound"
        options={{gestureEnabled: false}}
        component={UserNotFound}
      />
      <stack.Screen name="SignupSuccess" component={SignupSuccess} />
      <stack.Screen
        name="AskAboutUserInfo"
        options={{gestureEnabled: false}}
        component={AskAboutUserInfo}
      />
      <stack.Screen
        name="UserFound"
        options={{gestureEnabled: false}}
        component={UserFound}
      />
      <stack.Screen
        name="SetPasscode"
        options={{gestureEnabled: false}}
        component={SetPasscode}
      />
      <stack.Screen
        name="ChangeTheme"
        options={{gestureEnabled: false}}
        component={ChangeTheme}
      />
      <stack.Screen
        name="Unlock"
        options={{gestureEnabled: false}}
        component={Unlock}
      />
      <stack.Screen
        name="LoginOptions"
        options={{gestureEnabled: false}}
        component={LoginOptions}
      />
    </stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <drawer.Navigator
        drawerContent={props => <MenuContent {...props} />}
        screenOptions={{
          headerShown: false,
          swipeEnabled: false,
        }}>
        <drawer.Screen name="Home" component={StackNav} />
      </drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
