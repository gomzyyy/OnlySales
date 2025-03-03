import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Customer} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import useTheme from '../../../hooks/useTheme';

type TabProps = {
  i: Customer;
  lastIndex?: boolean;
};

const Tab: React.FC<TabProps> = ({i, lastIndex = false}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          marginBottom: lastIndex ? 70 : 6,
          backgroundColor: currentTheme.tab.bg,
        },
      ]}
      onPress={() => navigate('Customer', {customer: i})}>
      <Text style={[styles.customerName, {color: currentTheme.tab.label}]}>
        {i.fullName}
      </Text>
      <Icon name="right" color={currentTheme.tab.icon} size={22} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '400',
  },
});

export default Tab;
