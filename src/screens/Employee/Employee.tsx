import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Employee} from '../../../types';
import Header from '../../components/Header';
import { useTheme } from '../../hooks';

type EmployeeParams = {
  employee: Employee;
};
type EmployeeProps = {};
const Employee: React.FC<EmployeeProps> = ({}): React.JSX.Element => {
    const {currentTheme}=useTheme()
  const {params} = useRoute();
  const {employee} = params as EmployeeParams;
  return (
    <View style={styles.parent}>
      <Header name={employee.name} headerBgColor={currentTheme.baseColor} />
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {flex: 1},
  container: {
    paddingHorizontal: 10,
    flex: 1,
  },
});
export default Employee;
