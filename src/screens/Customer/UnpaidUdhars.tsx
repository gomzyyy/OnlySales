import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useState} from 'react';
import CustomerInfo from './components/CustomerInfo';
import {useRoute} from '@react-navigation/native';
import {Customer, newUdharProduct, Product} from '../../../types';
import Header from '../../components/Header';
import Tab from './components/Tab';
import CustomerHeader from '../../components/CustomerHeader';
import PopupContainer from '../../components/PopUp';
import TabLongPressOptions from './components/TabLongPressOptions';

type RouteType = {
  customer: Customer;
  products: newUdharProduct[];
  date: string;
};

const UnpaidUdhars = () => {
  const params = useRoute().params;
  const {customer, products, date} = params as RouteType;

  const [longPressActionOpen, setLongPressActionOpen] =
    useState<boolean>(false);

  const handleOpenLongPressOptions = () => setLongPressActionOpen(true);

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
            keyExtractor={i => i.addedAt}
            renderItem={({item}) => (
              <Tab i={item} longPressAction={handleOpenLongPressOptions} />
            )}
          />
        </View>
      </View>
      <PopupContainer
        open={longPressActionOpen}
        close={() => setLongPressActionOpen(false)}>
        <TabLongPressOptions />
      </PopupContainer>
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
  customerHeader: {
    marginTop: 40,
  },
  itemListContainer: {
    // marginTop: 20,
  },
});

export default UnpaidUdhars;
