import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, { Dispatch, SetStateAction } from 'react';
import {colors, currentTheme, deviceHeight} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {Customer, newUdharProduct} from '../../../../types';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {removeUdhar} from '../../../../store/slices/shopkeeper';

type TabLongPressOptionsProps = {
  product: newUdharProduct;
  customer: Customer;
  close:Dispatch<SetStateAction<boolean>>
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  product,
  customer,
  close
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteProduct = () => {
    dispatch(removeUdhar({product, customer}));
  };
  return (
    <View style={styles.parent}>
      <Text style={styles.label}>
        Product: {product.name}
        {` (${product.createdAt.split(' ').join(', ')})`}
      </Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.buttonDanger} activeOpacity={0.8} onPress={handleDeleteProduct}>
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
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.18,
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
