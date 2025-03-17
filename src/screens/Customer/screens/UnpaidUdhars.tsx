import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import CustomerInfo from '../components/CustomerInfo';
import {useRoute} from '@react-navigation/native';
import {Customer, SoldProduct} from '../../../../types';
import Header from '../../../components/Header';
import Tab from '../components/Tab';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import EmptyListMessage from '../../../components/EmptyListMessage';
import Icon from 'react-native-vector-icons/AntDesign';
import {back} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks/index';

type RouteType = {
  customer: Customer;
  products: SoldProduct[];
  date: string;
};

const UnpaidUdhars = () => {
  const {currentTheme} = useTheme();
  const params = useRoute().params;
  const {customer, date} = params as RouteType;
  const unpaidPayments: SoldProduct[] =
    useSelector((s: RootState) => s.appData.BusinessOwner.customers)?.find(
      c => c.id === customer.id,
    )?.unpaidPayments || [];

  return (
    <View style={styles.parent}>
      <Header
        name={date}
        backButtom={true}
        titleColor={currentTheme.header.textColor}
        headerBgColor={currentTheme.baseColor}
      />
      <View
        style={[styles.container, {backgroundColor: currentTheme.baseColor}]}>
        <CustomerInfo customer={customer} />
        {/* <View style={styles.customerHeader}>
          <CustomerHeader flex={false} />
        </View> */}
        <View style={styles.itemListContainer}>
          {unpaidPayments.length !== 0 ? (
            <FlatList
              data={unpaidPayments}
              keyExtractor={i => i.addedAt.toString()}
              renderItem={({item}) => (
                <Tab actionType="UNPAID" i={item} customer={customer} />
              )}
              nestedScrollEnabled
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <EmptyListMessage
                title="HOORAY! No UNPAID udhars at the momment."
                textColor={currentTheme.contrastColor}
              />
              <TouchableOpacity
                style={[
                  styles.backBtnContainer,
                  {backgroundColor: currentTheme.contrastColor},
                ]}
                onPress={() => back()}>
                <Icon
                  name="arrowleft"
                  size={20}
                  color={currentTheme.baseColor}
                />
                <Text
                  style={[styles.backBtnText, {color: currentTheme.baseColor}]}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  customerHeader: {
    marginTop: 20,
  },
  itemListContainer: {
    marginTop: 20,
  },
  emptyListContainer: {alignItems: 'center'},
  backBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 60,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backBtnText: {fontSize: 20, fontWeight: 'bold'},
});

export default UnpaidUdhars;
