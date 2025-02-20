import {View, Text, StyleSheet, Image, FlatList, Pressable} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import {useRoute} from '@react-navigation/native';
import {Customer as CustomerType, Product} from '../../../types';
const NoProfile = require('../../assets/images/no-profile.jpg');
import Icon from 'react-native-vector-icons/AntDesign';
import Tab, {ToogleButton} from './components/Tab';
import {Theme} from '../../utils/Constants';
import {ProductsByDate} from '../../components/shared/ProductByDate';
import CustomerInfo from './components/CustomerInfo';

const currentTheme = Theme[0];

type RouteParams = {
  customer: CustomerType;
};
type ToogleBtnArrType = {name: string; value: 'PAID' | 'UNPAID'};

const toogleBtnArr: ToogleBtnArrType[] = [
  {name: 'Unpaid Udhars', value: 'UNPAID'},
  {name: 'Paid Udhars', value: 'PAID'},
];

const Customer = () => {
  const params = useRoute().params;
  const {customer} = params as RouteParams;
  const [content, setContent] = useState<'PAID' | 'UNPAID'>('UNPAID');

  return (
    <View style={styles.parent}>
      <Header
        name={`${customer.fullName}`}
        backButtom
        customComponent={true}
        renderItem={<Icon name="plus" color={'black'} size={24} />}
      />
      <View style={styles.contentContainer}>
      <CustomerInfo customer={customer} />
        <View style={styles.contentToggleContainer}>
          <Pressable onPress={() => setContent('UNPAID')} style={{flex: 1}}>
            <ToogleButton
              title="Unpaid Udhars"
              bgcolor={content === 'UNPAID' ? currentTheme.tabColor : ''}
              textColor={content === 'UNPAID' ? currentTheme.contrastColor : ''}
            />
          </Pressable>
          <Pressable onPress={() => setContent('PAID')} style={{flex: 1}}>
            <ToogleButton
              title="Paid Udhars"
              bgcolor={content === 'PAID' ? currentTheme.tabColor : ''}
              textColor={content === 'PAID' ? currentTheme.contrastColor : ''}
            />
          </Pressable>
        </View>
        <View style={styles.dataContainer}>
          <ProductsByDate
          customer={customer}
            ArrWithDate={
              content === 'UNPAID'
                ? customer.unpaidPayments
                : customer.paidPayments
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  customerInfoContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    overflow: 'hidden',
    borderRadius: '50%',
    backgroundColor: 'red',
  },
  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'contain',
  },
  contentToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 20,
    gap: 10,
  },
  toogleBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentToggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dataContainer: {
    marginTop: 20,
  },
});

export default Customer;