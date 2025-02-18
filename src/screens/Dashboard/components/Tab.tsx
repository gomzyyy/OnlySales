import {View, Text} from 'react-native';
import React from 'react';
import { Customer } from '../../../../types';

type TabProps={
    i:Customer
}

const Tab:React.FC<TabProps> = ({i}):React.JSX.Element => {
  return (
    <View>
      <Text>{i.fullName}</Text>
    </View>
  );
};

export default Tab;
