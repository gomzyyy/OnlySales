import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../screens/Dashboard/Dashboard';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MenuContent from '../components/sub-components/MenuContent';
import Settings from '../screens/Settings/Settings';
import { navigationRef } from '../utils/nagivationUtils';
import Customer from '../screens/Customer/Customer';
import UnpaidUdhars from '../screens/Customer/UnpaidUdhars';
import MyMenu from '../screens/MyShelf/MyMenu';
import Search from '../screens/Search/Search';
import PaidUdhars from '../screens/Customer/PaidUdhars';
import MyProfile from '../screens/Settings/screens/MyProfile';

const stack = createNativeStackNavigator();
const drawer = createDrawerNavigator();

const StackNav = () => {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <stack.Screen name="Dashboard" component={Dashboard}/>
      <stack.Screen name="Settings" component={Settings}/>
      <stack.Screen name="Customer" component={Customer}/>
      <stack.Screen name="UnpaidUdhars" component={UnpaidUdhars}/>
      <stack.Screen name="PaidUdhars" component={PaidUdhars}/>
      <stack.Screen name="MyMenu" component={MyMenu}/>
      <stack.Screen name="Search" component={Search}/>
      <stack.Screen name="MyProfile" component={MyProfile}/>
    </stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <drawer.Navigator
      drawerContent={(props)=><MenuContent {...props}/>}
      screenOptions={{
        headerShown: false}}
      >
        <drawer.Screen name="Home" component={StackNav} />
      </drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
