import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Customer, SoldProduct} from '../../../../types';
import {deviceHeight} from '../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../hooks';
import {RootState} from '../../../../store/store';
import {useSelector} from 'react-redux';
import PayButton from '../../../components/PayButton';
import SlideUpContainer from '../../../components/SlideUpContainer';
import ConfirmPayment from '../../../components/ConfirmPayment';
import {TouchableOpacity} from 'react-native';
import EmptyListMessage from '../../../components/EmptyListMessage';
import {back} from '../../../utils/nagivationUtils';
import CustomerInfo from './CustomerInfo';
import Tab from './Tab';
import Icon from 'react-native-vector-icons/AntDesign';
import {PaymentState} from '../../../../enums';
import { useTranslation } from 'react-i18next';

type PaidPaymentsProps = {
  customer: Customer;
  date: string;
  products: SoldProduct[];
  close:()=>void
};

const PaidPayments: React.FC<PaidPaymentsProps> = ({
  customer,
  products,
  date,
  close
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
const {t} = useTranslation('customer')
  const [amount, setAmount] = useState<number>(0);
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const {owner} = useAnalytics();
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const pp =
    owner.customers
      .find(s => s._id === customer._id)
      ?.buyedProducts?.filter(f => f.state === PaymentState.PAID) || [];

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
        acc +
        (f.product.discountedPrice
          ? f.product.discountedPrice
          : f.product.basePrice) *
          f.count,
      0,
    );
    setAmount(amt);
  }, [products, amount]);

  return (
    <View style={[styles.parent, {backgroundColor: currentTheme.baseColor}]}>
      <Text style={[styles.label, {color: currentTheme.contrastColor}]}>
      {t('p_paidpayments_title')}
      </Text>
      <View
        style={[styles.container, {backgroundColor: currentTheme.baseColor}]}>
        <CustomerInfo customer={customer} />
        <View style={styles.itemListContainer}>
          {pp.length !== 0 ? (
            <FlatList
              data={pp}
              keyExtractor={i => i.createdAt}
              renderItem={({item}) => (
                <Tab
                  actionType="UNPAID"
                  i={item}
                  customer={customer}
                  onPay={() =>
                    openConfirmPay(
                      'SINGLE',
                      (item.product.discountedPrice || item.product.basePrice) *
                        item.count,
                    )
                  }
                  date={item.createdAt}
                  closeParent={close}
                />
              )}
              nestedScrollEnabled
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <EmptyListMessage
                title={t('p_paidpayments_nodata_title')}
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
      {products.length !== 0 && (
        <PayButton
        label={t('p_paidpayments_paybtn', {currency, amount})}
          pressAction={() => openConfirmPay('WHOLE')}
        />
      )}
      <SlideUpContainer
        open={askConfirmPayment}
        close={handleCloseConfirmPayment}
        opacity={0.4}
        height={deviceHeight * 0.5}
        >
        <ConfirmPayment
          value={payableAmount}
          setState={setPayableAmount}
          cancel={handleCloseConfirmPayment}
          currency={currency}
          callback={handleCloseConfirmPayment}
        />
      </SlideUpContainer>
      {/* <SlideUpContainer
        open={askConfirmPayment}
        close={handleCloseConfirmPayment}
        opacity={0.4}>
        <ConfirmPayment
          payableAmount={payableAmount}
          cancel={handleCloseConfirmPayment}
          currency={currency}
          callback={handleCloseConfirmPayment}
        />
      </SlideUpContainer> */}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.75,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 20,
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 20,
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

export default PaidPayments;
