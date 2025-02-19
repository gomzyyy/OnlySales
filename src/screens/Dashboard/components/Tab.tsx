import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {Customer} from '../../../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../../utils/Constants';
import {useDispatch} from 'react-redux';
import {removeCustomer} from '../../../../store/slices/shopkeeper';
import {AppDispatch} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import { navigate } from '../../../utils/nagivationUtils';

const currentTheme = Theme[0];

type TabProps = {
  i: Customer;
  lastIndex?: boolean;
};

const Tab: React.FC<TabProps> = ({i, lastIndex = false}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteCustomer = async (): Promise<void> => {
    const res = await Confirm(
      'Are you sure you want to remove this customer?',
      'Once customer removed, cannot be reversed! be careful of miss-touching removal button.',
    );
    if (res) {
      dispatch(removeCustomer(i));
      showToast({type: 'success', text1: 'Customer removed successfully.'});
      return;
    } else {
      showToast({type: 'info', text1: 'Removal canceled.'});
      return;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: lastIndex ? 70 : 6}]}
      onPress={()=>navigate("Settings")}
      >
      <Text style={styles.customerName}>{i.fullName}</Text>
      <TouchableOpacity onPress={handleDeleteCustomer}>
        <Icon name="delete" color={'#fff'} size={22} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: currentTheme.baseColor,
    borderRadius: 8,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '400',
    color: currentTheme.contrastColor,
  },
});

export default Tab;
