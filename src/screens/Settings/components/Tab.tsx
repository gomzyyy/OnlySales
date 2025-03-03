import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import useTheme from '../../../hooks/useTheme';

type TabProps = {
  title: string;
};

const Tab: React.FC<TabProps> = ({title}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: 6,    backgroundColor: currentTheme.tab.bg,
      }]}>
      <Text style={[styles.customerName,{    color: currentTheme.tab.label,
}]}>{title}</Text>
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
