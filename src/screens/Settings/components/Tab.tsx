import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {Customer} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {currentTheme} from '../../../utils/Constants';
import {navigate} from '../../../utils/nagivationUtils';

type TabProps = {
  title: string;
};

const Tab: React.FC<TabProps> = ({title}): React.JSX.Element => {
    
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: 6}]}>
      <Text style={styles.customerName}>{title}</Text>
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
    backgroundColor: currentTheme.tab.bg,
    borderRadius: 8,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '400',
    color: currentTheme.tab.label,
  },
});

export default Tab;
