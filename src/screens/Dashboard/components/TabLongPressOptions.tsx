import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, currentTheme, deviceHeight} from '../../../utils/Constants';
import {Customer} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {removeCustomer} from '../../../../store/slices/shopkeeper';
import Icon from 'react-native-vector-icons/AntDesign';

type TabLongPressOptionsProps = {
  i: Customer;
  close: () => void;
  triggerEdit: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  i,
  close,
  triggerEdit,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteCustomer = async (): Promise<void> => {
    const res = await Confirm(
      'Are you sure you want to remove this customer?',
      'Once customer removed, cannot be reversed! be careful of miss-touching removal button.',
    );
    if (res) {
      dispatch(removeCustomer(i));
      showToast({type: 'success', text1: 'Customer removed successfully.'});
      close();
      return;
    }
  };

  return (
    <View style={styles.parent}>
      <Text style={styles.label}>{i.fullName}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.buttonDanger}
          activeOpacity={0.8}
          onPress={handleDeleteCustomer}>
          <Text style={styles.buttonDangerText}>Delete</Text>
          <Icon name="delete" size={18} color={colors.danger} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonEdit}
          activeOpacity={0.8}
          onPress={triggerEdit}>
          <Text style={styles.buttonEditText}>Edit</Text>
          <Icon name="edit" size={18} color={colors.iconBlack} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.26,
    borderRadius: 20,
    marginTop: 60,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 26,
    gap: 10,
  },
  buttonDanger: {
    backgroundColor: colors.dangerFade,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonIconContainer: {
    alignItems: 'center',
  },
  buttonDangerText: {
    textAlign: 'center',
    color: colors.danger,
    fontSize: 20,
  },
  buttonEdit: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonEditText: {
    textAlign: 'center',
    color: currentTheme.modal.inputText,
    fontSize: 20,
  },
});

export default TabLongPressOptions;
