import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Employee as EmployeeType} from '../../../types';
import Header from '../../components/Header';
import {useTheme} from '../../hooks';

type EmployeeParams = {
  employee: EmployeeType;
};
type EmployeeProps = {};
const Employee: React.FC<EmployeeProps> = ({}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {params} = useRoute();
  const {employee} = params as EmployeeParams;
  const EditButton = (): React.JSX.Element => {
    return <ActivityIndicator color={currentTheme.header.textColor} />;
  };
  return (
    <View style={styles.parent}>
      <Header
        name={employee.name}
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
        backButtom
        // customComponent={true}
        renderItem={<EditButton />}
      />
      
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
