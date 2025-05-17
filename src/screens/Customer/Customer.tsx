import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {
  ReactNode,
  useEffect,
  useState,
} from 'react';
import Header from '../../components/Header';
import {useRoute} from '@react-navigation/native';
import {Customer as CustomerType, SoldProduct} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {ToogleButton} from './components/Tab';
import {ProductsByDate} from '../../components/shared/ProductByDate';
import CustomerInfo from './components/CustomerInfo';
import EmptyListMessage from '../../components/EmptyListMessage';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddUdhar from './components/AddUdhar';
import {toogleState} from '../../service/fn';
import {useTheme, useHaptics, useAnalytics} from '../../hooks';
import UnPaidPayments from './components/UnPaidPayments';
import PaidPayments from './components/PaidPayments';
import {PaymentState} from '../../../enums';
import {deviceHeight} from '../../utils/Constants';
import {useTranslation} from 'react-i18next';
import ConfirmPayment from '../../components/ConfirmPayment';
import ScanQRToPay from '../../components/ScanQRToPay';
import InvoicePDFViewer from '../PDFViewer/InvoicePDFViewer';
import SearchContainer from './components/SlideContainers/SearchContainer';

type RouteParams = {
  customer: CustomerType;
  openAddProduct: boolean | undefined;
};

const Customer = () => {
  const {lightTap} = useHaptics();
  const {currentTheme} = useTheme();
  const {t} = useTranslation('customer');
  const params = useRoute().params;
  const {customer, openAddProduct} = params as RouteParams;
  const {owner, currency} = useAnalytics();
  const customers: CustomerType[] = owner.customers;
  const [openSearchContainer, setOpenSearchContainer] =
    useState<boolean>(false);
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const [willingToPay, setWillingToPay] = useState<boolean>(false);
  const [openSoldProductPDFView, setOpenSoldProductPDFView] =
    useState<boolean>(false);
  const [currCustomer, setCurrCustomer] = useState<CustomerType>(customer);
  const [paidPayments, setPaidPayments] = useState<SoldProduct[]>([]);
  const [unpaidPayments, setUnpaidPayments] = useState<SoldProduct[]>([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [unpaidAmount, setUnpaidAmount] = useState<number>(0);
  const [addUdharVisible, setAddUdharVisible] = useState(
    openAddProduct || false,
  );
  const [content, setContent] = useState<'PAID' | 'UNPAID'>('UNPAID');
  const [openUnpaidSheet, setOpenUnpaidSheet] = useState<boolean>(false);
  const [openPaidSheet, setOpenPaidSheet] = useState<boolean>(false);
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
  const handleUnpaidAmount = () => {
    setUnpaidAmount(() => {
      let upa = unpaidPayments.reduce<number>(
        (total, curr) =>
          total +
          curr.count * (curr.product.discountedPrice ?? curr.product.basePrice),
        0,
      );
      setPayableAmount(upa);
      return upa;
    });
  };
  const handlePaidAmount = () => {
    setPaidAmount(
      paidPayments.reduce<number>(
        (total, curr) =>
          total +
          curr.count * (curr.product.discountedPrice ?? curr.product.basePrice),
        0,
      ),
    );
  };

  const handleCloseConfirmPayment = () => {
    setAskConfirmPayment(false);
  };
  const handleCloseQRCode = () => {
    setWillingToPay(false);
  };
  const handleCloseSINGLESoldProductViewer = () => {
    setOpenSoldProductPDFView(false);
  };

  const handlePayButton = async () => {
    setAskConfirmPayment(false);
    setWillingToPay(true);
  };
  const handleInvoiceButton = () => {
    setWillingToPay(false);
    setOpenSoldProductPDFView(true);
  };

  const openConfirmPay = () => {
    setAskConfirmPayment(true);
  };

  const findAndSetPayments = () => {
    const foundCustomer = customers.find(c => c._id === customer._id);
    if (foundCustomer) {
      setCurrCustomer(foundCustomer);
      setPaidPayments(
        foundCustomer.buyedProducts.filter(p => p.state === PaymentState.PAID),
      );
      setUnpaidPayments(
        foundCustomer.buyedProducts.filter(
          p =>
            p.state === PaymentState.UNPAID || p.state === PaymentState.PENDING,
        ),
      );
    }
  };

  const handleOpenSearchContainer = () => setOpenSearchContainer(true);
  const handleCloseSearchContainer = () => setOpenSearchContainer(false);

  useEffect(() => {
    findAndSetPayments();
  }, [customer, customers]);

  useEffect(() => {
    handlePaidAmount();
    handleUnpaidAmount();
  }, [paidPayments, unpaidPayments]);

  const handleTabPress = ({
    products,
    customer,
    date,
  }: {
    products: SoldProduct[];
    customer: CustomerType;
    date: string;
  }) => {
    openSearchContainer && handleCloseSearchContainer();
    if (content === 'PAID') {
      setPaidProps({products, customer, date});
      setOpenPaidSheet(true);
    } else {
      setUnpaidProps({products, customer, date});
      setOpenUnpaidSheet(true);
    }
  };

  const HeaderIcon = ({
    children,
    label,
    show = true,
  }: {
    children: ReactNode;
    label?: string;
    show?: boolean;
  }) => {
    if (show) {
      return (
        <View
          style={{
            backgroundColor: currentTheme.contrastColor,
            paddingVertical: 3,
            paddingHorizontal: 5,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {children}
          <Text
            style={{
              fontSize: 8,
              fontWeight: '900',
              color: currentTheme.baseColor,
            }}>
            {label}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.parent}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        name={currCustomer.name}
        backButton
        customComponent={content === 'UNPAID'}
        renderItem={
          <HeaderIcon label="Request" show={unpaidAmount !== 0}>
            <Icon name="qrcode" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction={openConfirmPay}
        renderItem1={
          <HeaderIcon label="Add">
            <Icon name="plus" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction1={toogleState(setAddUdharVisible).true}
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
      />
      <View
        style={[
          styles.contentContainer,
          {backgroundColor: currentTheme.baseColor},
        ]}>
        <CustomerInfo customer={currCustomer} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            borderRadius: 10,
            gap: 6,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 18,
              paddingVertical: 10,
              backgroundColor: currentTheme.contrastColor,
              borderRadius: 10,
              flex: 1,
            }}>
            <Text
              style={{
                fontWeight: 600,
                fontStyle: 'italic',
                color: currentTheme.baseColor,
              }}>
              {`Pendings:`}
              <Text
                style={{
                  fontWeight: 400,
                  fontStyle: 'normal',
                  color: '#000',
                }}>{` ${currency} ${unpaidAmount}`}</Text>
            </Text>
            <Text
              style={{
                fontWeight: 600,
                fontStyle: 'italic',
                color: currentTheme.baseColor,
              }}>
              {`Paid:`}
              <Text
                style={{
                  fontWeight: 400,
                  fontStyle: 'normal',
                  color: '#000',
                }}>{` ${currency} ${paidAmount}`}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: currentTheme.contrastColor,
              borderRadius: 10,
              paddingHorizontal: 6,
              paddingVertical: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.5}
            onPress={handleOpenSearchContainer}>
            <Icon1 name="search" size={18} color={currentTheme.baseColor} />
            <Text style={{fontSize: 10, color: currentTheme.baseColor}}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentToggleContainer}>
          <Pressable
            onPress={() => {
              setContent('UNPAID');
              lightTap();
            }}
            style={{flex: 1}}>
            <ToogleButton
              title={t('c_pendingpayments')}
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
              title={t('c_paidpayments')}
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
                title={t('c_empty_unpaid_title')}
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
              title={t('c_empty_paid_title')}
              textColor={currentTheme.contrastColor}
            />
          )}
        </View>
      </View>

      <SlideUpContainer
        open={addUdharVisible}
        close={() => setAddUdharVisible(false)}
        height={deviceHeight * 0.6}>
        <AddUdhar
          close={() => setAddUdharVisible(false)}
          customer={currCustomer}
        />
      </SlideUpContainer>

      <SlideUpContainer
        open={openUnpaidSheet}
        close={() => setOpenUnpaidSheet(false)}
        opacity={0.7}
        height={deviceHeight * 0.9}>
        <UnPaidPayments
          date={unpaidProps.date}
          customer={unpaidProps.customer}
          products={unpaidProps.products}
          close={() => setOpenUnpaidSheet(false)}
        />
      </SlideUpContainer>

      <SlideUpContainer
        open={openPaidSheet}
        close={() => setOpenPaidSheet(false)}
        opacity={0.7}
        height={deviceHeight * 0.9}>
        <PaidPayments
          date={paidProps.date}
          customer={paidProps.customer}
          products={paidProps.products}
          close={() => setOpenPaidSheet(false)}
        />
      </SlideUpContainer>

      <SlideUpContainer
        open={askConfirmPayment}
        close={handleCloseConfirmPayment}
        opacity={0.5}
        height={deviceHeight * 0.5}>
        <ConfirmPayment
          value={payableAmount}
          setState={setPayableAmount}
          cancel={handleCloseConfirmPayment}
          currency={currency}
          callback={handlePayButton}
          editable={false}
          soldProducts={customer.buyedProducts}
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={willingToPay}
        close={handleCloseQRCode}
        opacity={0.4}
        height={deviceHeight * 0.5}>
        <ScanQRToPay
          payableAmount={payableAmount}
          cancel={handleCloseQRCode}
          currency={currency}
          callback={handleInvoiceButton}
          pa="gomzydhingra0001@okhdfcbank"
          pn="Khata App"
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={openSoldProductPDFView}
        close={handleCloseSINGLESoldProductViewer}
        height={deviceHeight * 0.5}>
        <InvoicePDFViewer
          soldProducts={customer.buyedProducts}
          customer={customer}
          closeViewer={() => setOpenSoldProductPDFView(false)}
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={openSearchContainer}
        close={handleCloseSearchContainer}
        height={deviceHeight * 0.6}>
        <SearchContainer
          customer={customer}
          onTabPress={handleTabPress}
          close={handleCloseSearchContainer}
        />
      </SlideUpContainer>
    </KeyboardAvoidingView>
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
    flex: 1,
  },
});

export default Customer;
