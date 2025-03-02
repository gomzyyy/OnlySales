import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {Customer} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {currentTheme} from '../../../utils/Constants';
import {useDispatch} from 'react-redux';
import {removeCustomer} from '../../../../store/slices/shopkeeper';
import {AppDispatch} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {navigate} from '../../../utils/nagivationUtils';

type TabProps = {
  i: Customer;
  lastIndex?: boolean;
  handleOpenLongPressOptions?: (customer: Customer) => void;
  dummy?:boolean
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex = false,
  handleOpenLongPressOptions,
  dummy=false
}): React.JSX.Element => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [longPressed, setLongPressed] = useState<boolean>();

  const triggerLongPress = () => {
    timeoutRef.current = setTimeout(() => {
      handleOpenLongPressOptions && handleOpenLongPressOptions(i);
      setLongPressed(true);
    }, 200);
  };
  const cancelLongPress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setLongPressed(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: lastIndex ? 70 : 6}]}
      onPress={() => !longPressed && !dummy && navigate('Customer', {customer: i})}
      onPressIn={triggerLongPress}
      onPressOut={cancelLongPress}>
      <Text style={styles.customerName}>{i.fullName}</Text>
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
