import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Product} from '../../../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../hooks/useTheme';

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
  const {currentTheme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: lastIndex ? 70 : 6,
          backgroundColor: currentTheme.tabColor,
        },
      ]}>
      <View style={styles.tabLabel}>
        <Text style={[styles.productName, {color: currentTheme.contrastColor}]}>
          {i.name}
        </Text>
        <TouchableOpacity>
          <Icon name="delete" color={currentTheme.tab.icon} size={22} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => onPress(i)}
        style={styles.productInfoContainer}>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>Price: {i.basePrice}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
            Discounted price: {i.discountedPrice}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
            Includes: {i.quantity}
            {i.measurementType}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
            Total sold: {i.totalSold}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
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
  },
  productInfoContainer: {
    flex: 1,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 6,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tab;
