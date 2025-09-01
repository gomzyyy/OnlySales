import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Header from '../../components/Header';
import {useRoute} from '@react-navigation/native';
import {Customer as CustomerType, SoldProduct} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Octicons';
import {ToogleButton} from './components/Tab';
import {ProductsByDate} from '../../components/shared/ProductByDate';
import CustomerInfo from './components/CustomerInfo';
import EmptyListMessage from '../../components/EmptyListMessage';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddUdhar from './components/AddUdhar';
import {formatNumber, toogleState} from '../../service/fn';
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
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {back} from '../../utils/nagivationUtils';
import HeaderIcon from '../../components/HeaderIcon';
import FallbackMessage from '../../components/FallbackMessage';

type RouteParams = {
  customerId: CustomerType['_id'];
  openAddProduct: boolean | undefined;
};

const Customer = () => {
  const d = useDispatch<AppDispatch>();
  const {lightTap} = useHaptics();
  const {currentTheme} = useTheme();
  const {t} = useTranslation('customer');
  const params = useRoute().params;
  const {customerId, openAddProduct} = params as RouteParams;
  const {owner, currency} = useAnalytics();
  const {user} = useSelector((s: RootState) => s.appData);
  const customer = useMemo(
    () => owner.customers.find(s => s._id === customerId)!,
    [owner.customers, customerId],
  );
  if (!customer) {
    back();
    return null;
  }
  const customers: CustomerType[] = owner.customers;
  const [openSearchContainer, setOpenSearchContainer] =
    useState<boolean>(false);
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const [willingToPay, setWillingToPay] = useState<boolean>(false);
  const [openSoldProductPDFView, setOpenSoldProductPDFView] =
    useState<boolean>(false);
  const [paidPayments, setPaidPayments] = useState<SoldProduct[]>([]);
  const [unpaidPayments, setUnpaidPayments] = useState<SoldProduct[]>([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [unpaidAmount, setUnpaidAmount] = useState<number>(0);
  const [addUdharVisible, setAddUdharVisible] = useState(!!openAddProduct);
  const [content, setContent] = useState<'PAID' | 'UNPAID'>('UNPAID');
  const [openUnpaidSheet, setOpenUnpaidSheet] = useState<boolean>(false);
  const [openPaidSheet, setOpenPaidSheet] = useState<boolean>(false);
  const [unpaidProps, setUnpaidProps] = useState<{
    date: string;
  }>({date: ''});
  const [paidProps, setPaidProps] = useState<{
    date: string;
  }>({date: ''});

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
    if (customer) {
      setPaidPayments(
        customer.buyedProducts.filter(p => p.state === PaymentState.PAID),
      );
      setUnpaidPayments(
        customer.buyedProducts.filter(
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
  }, [paidPayments, unpaidPayments, owner, user]);

  const handleTabPress = ({
    date,
  }: {
    products: SoldProduct[];
    customer: CustomerType;
    date: string;
  }) => {
    openSearchContainer && handleCloseSearchContainer();
    if (content === 'PAID') {
      setPaidProps({date});
      setOpenPaidSheet(true);
    } else {
      setUnpaidProps({date});
      setOpenUnpaidSheet(true);
    }
  };

  const filterProductsByDate = (
    products: SoldProduct[],
    date: string,
  ): SoldProduct[] => {
    if (!date) return [];
    const targetDate = new Date(date).toISOString().slice(0, 10);
    return products.filter(
      p => new Date(p.createdAt).toISOString().slice(0, 10) === targetDate,
    );
  };

  const unpaidProductsByDate = useMemo(
    () =>
      filterProductsByDate(
        customer.buyedProducts.filter(
          p =>
            p.state === PaymentState.UNPAID || p.state === PaymentState.PENDING,
        ),
        unpaidProps.date,
      ),
    [customer, unpaidProps.date],
  );

  const paidProductsByDate = useMemo(
    () =>
      filterProductsByDate(
        customer.buyedProducts.filter(p => {
          return p.state === PaymentState.PAID;
        }),
        paidProps.date,
      ),
    [customer, paidProps.date],
  );

  return (
    <KeyboardAvoidingView
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        name={customer.name}
        backButton
        customComponent={content === 'UNPAID'}
        curved
        renderItem={
          <HeaderIcon label="Request" show={unpaidAmount !== 0}>
            <Icon name="qrcode" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction={openConfirmPay}
        renderItem1={
          <HeaderIcon label="Add">
            <Icon2 name="plus" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction1={toogleState(setAddUdharVisible).true}
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
      />
      <View
        style={[
          styles.contentContainer,
        ]}>
        <CustomerInfo customer={customer} />
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
              backgroundColor: currentTheme.fadeColor,
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
                }}>{` ${currency}${formatNumber(unpaidAmount)}`}</Text>
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
                }}>{` ${currency}${formatNumber(paidAmount)}`}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: currentTheme.fadeColor,
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
              textColor={currentTheme.baseColor}
              border={content === 'UNPAID'}
              borderColor={currentTheme.contrastColor}
              bgcolor={
                content === 'UNPAID'
                  ? currentTheme.fadeColor
                  : currentTheme.contrastColor
             }
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
              textColor={currentTheme.baseColor}
              border={content === 'PAID'}
              borderColor={currentTheme.contrastColor}
              bgcolor={
                content === 'PAID'
                  ? currentTheme.fadeColor
                  : currentTheme.contrastColor
              }
            />
          </Pressable>
        </View>

        <View style={styles.dataContainer}>
          {content === 'UNPAID' ? (
            unpaidPayments.length > 0 ? (
              <ProductsByDate
                customer={customer}
                ArrWithDate={unpaidPayments}
                onTabPress={handleTabPress}
              />
            ) : (
              <FallbackMessage
                text={t('c_empty_unpaid_title')}
              />
            )
          ) : paidPayments.length > 0 ? (
            <ProductsByDate
              customer={customer}
              ArrWithDate={paidPayments}
              onTabPress={handleTabPress}
            />
          ) : (
            <FallbackMessage
              text={t('c_empty_paid_title')}
            />
          )}
        </View>
      </View>

      <SlideUpContainer
        open={addUdharVisible}
        close={() => setAddUdharVisible(false)}
        height={deviceHeight * 0.6}>
        <AddUdhar close={() => setAddUdharVisible(false)} customer={customer} />
      </SlideUpContainer>

      <SlideUpContainer
        open={openUnpaidSheet}
        close={() => setOpenUnpaidSheet(false)}
        opacity={0.7}
        height={deviceHeight * 0.9}
        usepadding={false}
        >
        <UnPaidPayments
          date={unpaidProps.date}
          customer={customer}
          products={unpaidProductsByDate}
          close={() => setOpenUnpaidSheet(false)}
        />
      </SlideUpContainer>

      <SlideUpContainer
        open={openPaidSheet}
        close={() => setOpenPaidSheet(false)}
        opacity={0.7}
        height={deviceHeight * 0.9}
        usepadding={false}
        >
        <PaidPayments
          date={paidProps.date}
          customer={customer}
          products={paidProductsByDate}
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
        height={deviceHeight * 0.6}
        heightLimit={450}>
        <ScanQRToPay
          payableAmount={payableAmount}
          cancel={handleCloseQRCode}
          currency={currency}
          callback={handleInvoiceButton}
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={openSoldProductPDFView}
        close={handleCloseSINGLESoldProductViewer}
        height={deviceHeight * 0.5}>
        <InvoicePDFViewer
          soldProducts={unpaidProductsByDate}
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
    marginTop: 10,
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
