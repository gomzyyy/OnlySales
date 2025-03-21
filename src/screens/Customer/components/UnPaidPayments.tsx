import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Customer, SoldProduct} from '../../../../types';
import {deviceHeight} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
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
import ScanQRToPay from '../../../components/ScanQRToPay';

type UnpaidPaymentsProps = {
  customer: Customer;
  date: string;
  products: SoldProduct[];
};

const UnPaidPayments: React.FC<UnpaidPaymentsProps> = ({
  customer,
  products,
  date,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const [amount, setAmount] = useState<number>(0);
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const [willingToPay, setWillingToPay] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<SoldProduct[]>([]);
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const up =
    useSelector((s: RootState) => s.appData.BusinessOwner.customers)
      .find(s => s.id === customer.id)
      ?.unpaidPayments?.flatMap(d =>
        products.filter(f => f.id === d.id && f.addedAt === d.addedAt),
      ) || [];

  const handleCloseConfirmPayment = () => {
    setAskConfirmPayment(false);
  };
  const handleCloseQRCode = () => {
    setWillingToPay(false);
  };
  const openConfirmPay = (payAs: 'WHOLE' | 'SINGLE', item?: SoldProduct) => {
    if (payAs === 'WHOLE') {
      setPayableAmount(amount);
    } else if (payAs === 'SINGLE' && item) {
      setPayableAmount(
        (item.discountedPrice && item.discountedPrice !== 0
          ? item.discountedPrice
          : item.basePrice) * item.count,
      );
    }
    setAskConfirmPayment(true);
  };

  const handlePayButton = () => {
    setAskConfirmPayment(false);
    setWillingToPay(true);
  };

  useEffect(() => {
    const amt = products.reduce(
      (acc, f) =>
        acc + (f.discountedPrice ? f.discountedPrice : f.basePrice) * f.count,
      0,
    );
    setAmount(amt);
  }, [products, amount]);

  return (
    <View style={[styles.parent, {backgroundColor: currentTheme.baseColor}]}>
      <Text style={[styles.label, {color: currentTheme.contrastColor}]}>
        Pending Payments
      </Text>
      <View
        style={[styles.container, {backgroundColor: currentTheme.baseColor}]}>
        <CustomerInfo customer={customer} />
        <View style={styles.itemListContainer}>
          {up.length !== 0 ? (
            <FlatList
              data={up}
              keyExtractor={i => i.addedAt.toString()}
              renderItem={({item}) => (
                <Tab
                  actionType="UNPAID"
                  i={item}
                  customer={customer}
                  onPay={() => openConfirmPay('SINGLE', item)}
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
      {products.length !== 0 && (
        <PayButton
          label={`Pay ${currency} ${amount}`}
          pressAction={() => openConfirmPay('WHOLE')}
        />
      )}
      <SlideUpContainer
        open={askConfirmPayment}
        close={handleCloseConfirmPayment}
        opacity={0.5}>
        <ConfirmPayment
          value={payableAmount}
          setState={setPayableAmount}
          cancel={handleCloseConfirmPayment}
          currency={currency}
          callback={handlePayButton}
          editable={false}
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={willingToPay}
        close={handleCloseQRCode}
        opacity={0.4}>
        <ScanQRToPay
          payableAmount={payableAmount}
          cancel={handleCloseQRCode}
          currency={currency}
          callback={handlePayButton}
          // products={}
          pa="gomzydhingra0001@okhdfcbank"
          pn="Khata App"
        />
      </SlideUpContainer>
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

export default UnPaidPayments;
