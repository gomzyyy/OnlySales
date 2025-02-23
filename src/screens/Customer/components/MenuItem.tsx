import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Product} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {currentTheme} from '../../../utils/Constants';

type MenuItemProps = {
  product: Product;
  addIcon?: boolean;
  removeIcon?: boolean;
  callback: ({
    product,
    action,
    count,
  }: {
    product: Product;
    action: 'ADD' | 'MINUS';
    count: number;
  }) => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  product,
  addIcon = true,
  removeIcon = true,
  callback,
}): React.JSX.Element => {
  const [count, setCount] = useState<number>(0);

  const handlePlusMinus = (action: 'ADD' | 'MINUS') => {
    if (action === 'ADD') {
      setCount(p => (p += 1));
    }
    if (action === 'MINUS') {
      if (count === 0) {
        return;
      }
      setCount(p => (p -= 1));
    }
    callback({product, action, count});
    return;
  };

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <View style={styles.parent}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => handlePlusMinus('ADD')}>
          {addIcon && (
            <Icon name="plus" size={20} color={currentTheme.baseColor} />
          )}
        </TouchableOpacity>

        <Text style={styles.itemText}>
          {count} {product.name}
        </Text>
        <TouchableOpacity onPress={() => handlePlusMinus('MINUS')}>
          {removeIcon && (
            <Icon name="minus" size={20} color={currentTheme.baseColor} />
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
    borderColor: currentTheme.baseColor,
  },
  innerContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  itemText: {
    fontSize: 20,
    color: currentTheme.baseColor,
  },
});

export default MenuItem;
