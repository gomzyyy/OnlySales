import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../screens/Dashboard/Dashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MenuContent from '../components/sub-components/MenuContent';
import Settings from '../screens/Settings/Settings';
import {navigationRef} from '../utils/nagivationUtils';
import Customer from '../screens/Customer/Customer';
import UnpaidUdhars from '../screens/Customer/UnpaidUdhars';
import MyMenu from '../screens/MyShelf/MyMenu';
import Search from '../screens/Search/Search';
import PaidUdhars from '../screens/Customer/PaidUdhars';
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

const stack = createNativeStackNavigator();
const drawer = createDrawerNavigator();

const StackNav = () => {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <stack.Screen name="SplashScreen" component={SplashScreen} />
      <stack.Screen name="Dashboard" component={Dashboard} />
      <stack.Screen name="Settings" component={Settings} />
      <stack.Screen name="Customer" component={Customer} />
      <stack.Screen name="UnpaidUdhars" component={UnpaidUdhars} />
      <stack.Screen name="PaidUdhars" component={PaidUdhars} />
      <stack.Screen name="MyMenu" component={MyMenu} />
      <stack.Screen name="Search" component={Search} />
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
        name="Unlock"
        options={{gestureEnabled: false}}
        component={Unlock}
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
