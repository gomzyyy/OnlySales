import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Customer, Product} from '../../../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Theme} from '../../../utils/Constants';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {navigate} from '../../../utils/nagivationUtils';

const currentTheme = Theme[0];

type TabProps = {
  i: Product;
  lastIndex?: boolean;
  onPress: (product:Product) => void;
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex = false,
  onPress,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: lastIndex ? 70 : 6}]}
      onPress={()=>onPress(i)}>
      <View style={styles.tabLabel}>
        <Text style={styles.productName}>{i.name}</Text>
        <TouchableOpacity>
          <Icon name="delete" color={'#fff'} size={22} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfoContainer}>
        <View>
          <Text>Price: {i.basePrice}</Text>
        </View>
        <View>
          <Text>Discounted price: {i.discountedPrice}</Text>
        </View>
        <View>
          <Text>
            Includes: {i.quantity}
            {i.measurementType}
          </Text>
        </View>
        <View>
          <Text>Total sold: {i.totalSold}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
    backgroundColor: currentTheme.tabColor,
    borderRadius: 8,
    height: 150,
    width: 150,
  },
  tabLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 20,
    fontWeight: '400',
    color: currentTheme.contrastColor,
  },
  productInfoContainer: {
    flex: 1,
  },
});

export default Tab;
