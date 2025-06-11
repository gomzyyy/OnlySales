import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Product} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../hooks/index';
import {colors} from '../../../utils/Constants';

type InventoryItemProps = {
  product: Product;
  addIcon?: boolean;
  removeIcon?: boolean;
  callback: ({
    product,
    action,
  }: {
    product: Product;
    action: 'ADD' | 'MINUS';
  }) => void;
  onSelectProduct: (data: {
    product: Product;
    count: number;
  }) => void;
};

const InventoryItem: React.FC<InventoryItemProps> = ({
  product,
  addIcon = true,
  removeIcon = true,
  callback,
  onSelectProduct,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const [count, setCount] = useState<number>(0);

  const handlePlusMinus = (action: 'ADD' | 'MINUS') => {
    let newCount = count;
    if (action === 'ADD') {
      newCount = count + 1;
    } else {
      if (count === 0) {
        return;
      }
      newCount = count - 1;
    }
    setCount(newCount);
    const data = {product, action, count: newCount};
    callback(data);
    onSelectProduct({
      product,
      count: newCount,
    });
  };

  return (
    <View
      style={[
        styles.parent,
        {
          borderColor:
            product.stock === 0 ? colors.danger : currentTheme.baseColor,
        },
      ]}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => handlePlusMinus('ADD')}>
          {addIcon && (
            <Icon
              name="plus"
              size={20}
              color={
                product.stock === 0 ? colors.danger : currentTheme.baseColor
              }
            />
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.itemText,
            {
              color:
                product.stock === 0 ? colors.danger : currentTheme.baseColor,
            },
          ]}>{`${count}  ${product.name}`}</Text>
        <TouchableOpacity onPress={() => handlePlusMinus('MINUS')}>
          {removeIcon && (
            <Icon
              name="minus"
              size={20}
              color={
                product.stock === 0 ? colors.danger : currentTheme.baseColor
              }
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 1,
    height: 'auto',
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  innerContainer: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    fontSize: 20,
  },
});

export default InventoryItem;