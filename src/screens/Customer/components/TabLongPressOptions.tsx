import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {Customer, SoldProduct} from '../../../../types';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {
  removePaidUdhar,
  removeUdhar,
} from '../../../../store/slices/business';
import {useTheme} from '../../../hooks/index';

type TabLongPressOptionsProps = {
  product: SoldProduct;
  customer: Customer;
  close: Dispatch<SetStateAction<boolean>>;
  actionType: 'PAID' | 'UNPAID';
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  product,
  customer,
  close,
  actionType,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteProduct = () => {
    if (actionType === 'UNPAID') {
      dispatch(removeUdhar({product, customer}));
      return;
    } else if (actionType === 'PAID') {
      dispatch(removePaidUdhar({product, customer}));
      return;
    } else {
      return;
    }
  };
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>
        {product.name}
        {` (${product.createdAt.split(' ').join(', ')})`}
      </Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.buttonDanger}
          activeOpacity={0.8}
          onPress={handleDeleteProduct}>
          <Text style={styles.buttonDangerText}>Delete</Text>
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
    elevation: 30,
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
});

export default TabLongPressOptions;
