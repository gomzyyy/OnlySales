import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Product} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import useTheme from '../../../hooks/useTheme';

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
  const {currentTheme} = useTheme();

  const [count, setCount] = useState<number>(0);

  const handlePlusMinus = (action: 'ADD' | 'MINUS') => {
    setCount(prevCount => {
      let newCount;

      if (action === 'ADD') {
        newCount = prevCount + 1;
      } else {
        if (prevCount === 0) {
          return prevCount;
        }
        newCount = prevCount - 1;
      }
      const data = {product, action, count: newCount};
      callback(data);
      return newCount;
    });
  };

  return (
    <View style={[styles.parent, {borderColor: currentTheme.baseColor}]}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => handlePlusMinus('ADD')}>
          {addIcon && (
            <Icon name="plus" size={20} color={currentTheme.baseColor} />
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.itemText,
            {color: currentTheme.baseColor},
          ]}>{`${count}  ${product.name}`}</Text>
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

export default MenuItem;
