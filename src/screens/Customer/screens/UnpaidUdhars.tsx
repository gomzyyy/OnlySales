import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {useAnalytics, useTheme} from '../../../hooks/index';
import PayButton from '../../../components/PayButton';
import SlideUpContainer from '../../../components/SlideUpContainer';
import ConfirmPayment from '../../../components/ConfirmPayment';

type UnpaidUdharsProps = {
  customer: Customer;
  date: string;
  products: SoldProduct[];
};

const UnpaidUdhars: React.FC<UnpaidUdharsProps> = ({
  customer,
  date,
  products,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {customers} = useAnalytics();
  // const params = useRoute().params;
  // const {customer, date, products} = params as UnpaidUdharsParams;
  const [amount, setAmount] = useState<number>(0);
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const unpaidPayments: SoldProduct[] =
    customers?.find(c => c.id === customer.id)?.unpaidPayments || [];

  const handleCloseConfirmPayment = () => {
    setAskConfirmPayment(false);
  };
  const openConfirmPay = (payAs: 'WHOLE' | 'SINGLE', itemPrice: number = 0) => {
    if (payAs === 'WHOLE') {
      setPayableAmount(amount);
    } else {
      setPayableAmount(itemPrice);
    }
    setAskConfirmPayment(true);
  };

  useEffect(() => {
    const amt = products.reduce(
      (acc, f) =>
        acc + (f.discountedPrice ? f.discountedPrice : f.basePrice) * f.count,
      0,
    );
    setAmount(amt);
  }, [unpaidPayments, amount]);

  return (
    <View style={styles.parent}>
      <Header
        name={date}
        backButton={true}
        titleColor={currentTheme.header.textColor}
        headerBgColor={currentTheme.baseColor}
      />
      <View
        style={[styles.container, {backgroundColor: currentTheme.baseColor}]}>
        <CustomerInfo customer={customer} />
        <View style={styles.itemListContainer}>
          {products.length !== 0 ? (
            <FlatList
              data={products}
              keyExtractor={i => i.createdAt}
              renderItem={({item}) => (
                <Tab
                  actionType="UNPAID"
                  i={item}
                  customer={customer}
                  onPay={() =>
                    openConfirmPay(
                      'SINGLE',
                      (item.product.discountedPrice || item.product.basePrice) * item.count,
                    )
                  }
                />
              )}
              nestedScrollEnabled
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <EmptyListMessage
                title="HOORAY! No UNPAID Payments at the momment."
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
      {unpaidPayments.length !== 0 && (
        <PayButton
          label={`Pay ${currency} ${amount}`}
          pressAction={() => openConfirmPay('WHOLE')}
        />
      )}
      <SlideUpContainer
        open={askConfirmPayment}
        close={handleCloseConfirmPayment}
        opacity={0.4}>
        <ConfirmPayment
          value={payableAmount}
          setState={setPayableAmount}
          cancel={handleCloseConfirmPayment}
          currency={currency}
          callback={handleCloseConfirmPayment}
        />
      </SlideUpContainer>
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
