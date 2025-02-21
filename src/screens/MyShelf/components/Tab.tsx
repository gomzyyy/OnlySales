import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Product} from '../../../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {currentTheme} from '../../../utils/Constants';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';

type TabProps = {
  i: Product;
  lastIndex?: boolean;
  onPress: (product: Product) => void;
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
      onPress={() => onPress(i)}>
      <View style={styles.tabLabel}>
        <Text style={styles.productName}>{i.name}</Text>
        <TouchableOpacity>
          <Icon name="delete" color={currentTheme.tab.icon} size={22} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfoContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Price: {i.basePrice}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Discounted price: {i.discountedPrice}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Includes: {i.quantity}
            {i.measurementType}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Total sold: {i.totalSold}</Text>
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
    marginTop:10
  },
  infoContainer: {
    marginTop:6
  },
  infoText: {
    color: currentTheme.tab.label,
    fontSize:16,
    fontWeight:"bold"
  },
});

export default Tab;
