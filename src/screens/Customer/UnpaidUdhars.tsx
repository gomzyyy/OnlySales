import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import CustomerInfo from './components/CustomerInfo';
import {useRoute} from '@react-navigation/native';
import {Customer, Product} from '../../../types';
import Header from '../../components/Header';
import Tab from './components/Tab';
import CustomerHeader from '../../components/CustomerHeader';
import { currentTheme } from '../../utils/Constants';

type RouteType = {
  customer: Customer;
  products: Product[];
  date: string;
};

const UnpaidUdhars = () => {
  const params = useRoute().params;
  const {customer, products, date} = params as RouteType;
  return (
    <View style={styles.parent}>
      <Header name={date} backButtom={true} />
      <View style={styles.container}>
        <CustomerInfo customer={customer} />
        <View style={styles.customerHeader}>
          <CustomerHeader flex={false} />
        </View>
        <View style={styles.itemListContainer}>
          <FlatList
            data={products}
            keyExtractor={i => i.id}
            renderItem={({item}) => <Tab i={item} />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  customerHeader:{
    marginTop:40
  },
  itemListContainer: {
    // marginTop: 20,
  },
});

export default UnpaidUdhars;
