import {View, StyleSheet, Pressable, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useRoute} from '@react-navigation/native';
import {
  Customer as CustomerType,
  Employee,
  Owner,
  Partner,
  SoldProduct,
} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {ToogleButton} from './components/Tab';
import {ProductsByDate} from '../../components/shared/ProductByDate';
import CustomerInfo from './components/CustomerInfo';
import EmptyListMessage from '../../components/EmptyListMessage';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddUdhar from './components/AddUdhar';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {toogleState} from '../../service/fn';
import {useTheme, useHaptics, useAnalytics} from '../../hooks';
import UnPaidPayments from './components/UnPaidPayments';
import PaidPayments from './components/PaidPayments';
import {PaymentState} from '../../../enums';
import { deviceHeight } from '../../utils/Constants';

type RouteParams = {
  customer: CustomerType;
};

const Customer = () => {
  const {lightTap} = useHaptics();
  const {currentTheme} = useTheme();
  const params = useRoute().params;
  const {customer} = params as RouteParams;
  const {owner} = useAnalytics();

  const customers: CustomerType[] = owner.customers;

  const [currCustomer, setCurrCustomer] = useState<CustomerType>(customer);
  const [paidPayments, setPaidPayments] = useState<SoldProduct[]>([]);
  const [unpaidPayments, setUnpaidPayments] = useState<SoldProduct[]>([]);
  const [addUdharVisible, setAddUdharVisible] = useState(false);
  const [content, setContent] = useState<'PAID' | 'UNPAID'>('UNPAID');

  const [openUnpaidSheet, setOpenUnpaidSheet] = useState(false);
  const [openPaidSheet, setOpenPaidSheet] = useState(false);
  const [unpaidProps, setUnpaidProps] = useState<{
    products: SoldProduct[];
    customer: CustomerType;
    date: string;
  }>({products: [], customer, date: ''});
  const [paidProps, setPaidProps] = useState<{
    products: SoldProduct[];
    customer: CustomerType;
    date: string;
  }>({products: [], customer, date: ''});

  useEffect(() => {
    const foundCustomer = customers.find(c => c._id === customer._id);
    if (foundCustomer) {
      setCurrCustomer(foundCustomer);
      setPaidPayments(
        foundCustomer.buyedProducts.filter(p => p.state === PaymentState.PAID),
      );
      setUnpaidPayments(
        foundCustomer.buyedProducts.filter(
          p => p.state === PaymentState.UNPAID,
        ),
      );
    }
  }, [customer, customers]);

  const handleTabPress = ({
    products,
    customer,
    date,
  }: {
    products: SoldProduct[];
    customer: CustomerType;
    date: string;
  }) => {
    if (content === 'PAID') {
      setPaidProps({products, customer, date});
      setOpenPaidSheet(true);
    } else {
      setUnpaidProps({products, customer, date});
      setOpenUnpaidSheet(true);
    }
  };

  const AddUdharIcon = () => (
    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
      <Icon name="plus" color={currentTheme.header.textColor} size={20} />
      <Text style={{fontSize: 16, color: currentTheme.header.textColor}}>
        Add
      </Text>
    </View>
  );

  return (
    <View style={styles.parent}>
      <Header
        name={currCustomer.name}
        backButtom
        customComponent={content === 'UNPAID'}
        renderItem={<AddUdharIcon />}
        customAction={toogleState(setAddUdharVisible).true}
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
      />
      <View
        style={[
          styles.contentContainer,
          {backgroundColor: currentTheme.baseColor},
        ]}>
        <CustomerInfo customer={currCustomer} />
        <View style={styles.contentToggleContainer}>
          <Pressable
            onPress={() => {
              setContent('UNPAID');
              lightTap();
            }}
            style={{flex: 1}}>
            <ToogleButton
              title="Pending Payments"
              textColor={currentTheme.contrastColor}
              border={content === 'UNPAID'}
              borderColor={currentTheme.contrastColor}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setContent('PAID');
              lightTap();
            }}
            style={{flex: 1}}>
            <ToogleButton
              title="Paid Payments"
              textColor={currentTheme.contrastColor}
              border={content === 'PAID'}
              borderColor={currentTheme.contrastColor}
            />
          </Pressable>
        </View>

        <View style={styles.dataContainer}>
          {content === 'UNPAID' ? (
            unpaidPayments.length > 0 ? (
              <ProductsByDate
                customer={currCustomer}
                ArrWithDate={unpaidPayments}
                onTabPress={handleTabPress}
              />
            ) : (
              <EmptyListMessage
                title="HURRAY! No Pending Payments"
                textColor={currentTheme.contrastColor}
              />
            )
          ) : paidPayments.length > 0 ? (
            <ProductsByDate
              customer={currCustomer}
              ArrWithDate={paidPayments}
              onTabPress={handleTabPress}
            />
          ) : (
            <EmptyListMessage
              title="Oops! No Paid Payments"
              textColor={currentTheme.contrastColor}
            />
          )}
        </View>
      </View>

      <SlideUpContainer
        open={addUdharVisible}
        close={() => setAddUdharVisible(false)}
        height={deviceHeight * 0.55}
        >
        <AddUdhar
          close={() => setAddUdharVisible(false)}
          customer={currCustomer}
        />
      </SlideUpContainer>

      <SlideUpContainer
        open={openUnpaidSheet}
        close={() => setOpenUnpaidSheet(false)}
        opacity={0.7}
        height={ deviceHeight * 0.75}
        >
        <UnPaidPayments
          date={unpaidProps.date}
          customer={unpaidProps.customer}
          products={unpaidProps.products}
        />
      </SlideUpContainer>

      <SlideUpContainer
        open={openPaidSheet}
        close={() => setOpenPaidSheet(false)}
        opacity={0.7}
        height={deviceHeight * 0.75}
        >
        <PaidPayments
          date={paidProps.date}
          customer={paidProps.customer}
          products={paidProps.products}
        />
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 20,
    gap: 10,
  },
  dataContainer: {
    marginTop: 20,
  },
});

export default Customer;
