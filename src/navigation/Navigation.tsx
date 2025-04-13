import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../screens/Dashboard/Dashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MenuContent from '../components/sub-components/MenuContent';
import Settings from '../screens/Settings/Settings';
import {navigationRef} from '../utils/nagivationUtils';
import Customer from '../screens/Customer/Customer';
import MyInventory from '../screens/MyInventory/MyInventory';
import SearchCustomer from '../screens/SearchCustomer/SearchCustomer';
import SearchEmployee from '../screens/SearchEmpolyee/SearchEmployee';
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
import AppInfo from '../screens/Settings/screens/AppInfo';
import VerifyPassword from '../screens/Auth/Login/screens/VerifyUserPassword';
import SetPassword from '../screens/Auth/SignUp/screens/SetPassword';
import RequestOTPEmail from '../screens/Auth/Validate/Email/RequestOTPEmail';
import VerifyEmail from '../screens/Auth/Validate/Email/VerifyEmail';

const stack = createNativeStackNavigator();
const drawer = createDrawerNavigator();

const StackNav = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {appLocked} = useSelector((s: RootState) => s.appData.app);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      // if (
      //   nextAppState === 'background' ||
      //   (nextAppState === 'inactive' &&
      //     accessPasscode &&
      //     Array.isArray(accessPasscode))
      // ) {
      //   dispatch(toogleLockApp(true));
      // }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [appLocked, dispatch]);
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
      <stack.Screen name="Employee" component={Employee} />
      <stack.Screen name="SearchEmployee" component={SearchEmployee} />
      <stack.Screen name="MyInventory" component={MyInventory} />
      <stack.Screen name="MyProfile" component={MyProfile} />
      <stack.Screen name="AppInfo" component={AppInfo} />
      <stack.Screen name="GetStarted" component={GetStarted} />
      <stack.Screen name="VerifyPassword" component={VerifyPassword} />
      <stack.Screen name="RequestOTPEmail" component={RequestOTPEmail} />
      <stack.Screen name="VerifyEmail" component={VerifyEmail} />
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
      <stack.Screen name="SetPassword" component={SetPassword} />
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
