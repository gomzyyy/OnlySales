import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import { Product} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {removeProductFromMenu} from '../../../../store/slices/shopkeeper';
import Icon from 'react-native-vector-icons/AntDesign';
import useTheme from '../../../hooks/useTheme';

type TabLongPressOptionsProps = {
  i: Product;
  close: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  i,
  close,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();

  const handleDeleteCustomer = async (): Promise<void> => {
    const res = await Confirm(
      'Are you sure you want to remove this product?',
      'Once product removed, cannot be reversed! be careful of miss-touching removal button.',
    );
    if (res) {
      dispatch(removeProductFromMenu({product:i}));
      showToast({type: 'success', text1: 'Customer removed successfully.'});
      close();
      return;
    }
  };

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>{i.name}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.buttonDanger, {backgroundColor: colors.dangerFade}]}
          activeOpacity={0.8}
          onPress={handleDeleteCustomer}>
          <Text
            style={[
              styles.buttonDangerText,
              {color: colors.danger},
            ]}>
            Delete
          </Text>
          <Icon name="delete" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 20,
    height: deviceHeight * 0.18,
    borderRadius: 20,
    marginTop: 60,
    elevation:30,
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

    fontSize: 20,
  },
});

export default TabLongPressOptions;
