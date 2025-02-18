import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Dashboard from '../screens/Dashboard/Dashboard';

const stack = createNativeStackNavigator();

const Navigation = () => {
  return (
      <NavigationContainer>
        <stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <stack.Screen name="Dashboard" component={Dashboard}></stack.Screen>
        </stack.Navigator>
      </NavigationContainer>
  );
};

export default Navigation;
