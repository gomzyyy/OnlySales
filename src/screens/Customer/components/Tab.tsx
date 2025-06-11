import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {Customer, SoldProduct} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import TabLongPressOptions from './TabLongPressOptions';
import PopupContainer from '../../../components/PopUp';
import {useStorage, useTheme} from '../../../hooks/index';
import {useTranslation} from 'react-i18next';
import {colors, deviceHeight} from '../../../utils/Constants';
import SlideUpContainer from '../../../components/SlideUpContainer';
import ConfirmPayment from '../../../components/ConfirmPayment';
import ScanQRToPay from '../../../components/ScanQRToPay';
import {updateSoldProductStateAPI} from '../../../api/api.soldproduct';
import {PaymentState} from '../../../../enums';
import InvoicePDFViewer from '../../PDFViewer/InvoicePDFViewer';
import {showToast} from '../../../service/fn';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TabProps = {
  i: SoldProduct;
  lastIndex?: boolean;
  customer: Customer;
  actionType: 'PAID' | 'UNPAID';
  dummy?: boolean;
  onPay?: () => void;
  date: string;
  closeParent: () => void;
};

type ToogleButtonProps = {
  title: string;
  bgcolor?: string;
  textColor: string;
  border?: boolean;
  borderColor?: string;
};

const ToogleButton: React.FC<ToogleButtonProps> = ({
  title,
  bgcolor = '',
  textColor,
  border = false,
  borderColor = '',
}): React.JSX.Element => {
  return (
    <View
      style={[
        styles.contentToggleBtn,
        {
          backgroundColor: bgcolor,
          borderWidth: border ? 2 : 0,
          borderColor,
        },
      ]}>
      <Text style={[styles.toogletext, {color: textColor}]}>{title}</Text>
    </View>
  );
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex,
  customer,
  actionType,
  dummy = false,
  date,
  closeParent,
}): React.JSX.Element => {
  const d = useDispatch<AppDispatch>();
  const {t} = useTranslation('customer');
  const {currentTheme} = useTheme();
  const {local} = useStorage();
  const {updateUser} = local;
  const {app} = useSelector((s: RootState) => s.appData);
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const [willingToPay, setWillingToPay] = useState<boolean>(false);
  const [openSoldProductPDFView, setOpenSoldProductPDFView] =
    useState<boolean>(false);
  const [changingState, setChangingState] = useState<boolean>(false);
  const [longPressActionOpen, setLongPressActionOpen] =
    useState<boolean>(false);
  const handleCloseConfirmPayment = () => {
    setAskConfirmPayment(false);
  };
  const handleCloseQRCode = () => {
    // payment confirmation
    setWillingToPay(false);
  };
  const handleCloseSoldProductInvoiceViewer = () => {
    setOpenSoldProductPDFView(false);
  };
  const changeSoldProductState = async (
    state: PaymentState,
    closeContainer: boolean = false,
  ) => {
    try {
      setChangingState(true);
      await updateSoldProductStateAPI({
        query: {
          role: user.role,
          updatedState: state,
        },
        body: {
          soldProducts: [i],
        },
      });
      await updateUser();
      closeContainer && closeParent();
    } catch (error) {
      showToast({type: 'info', text1: 'unable to change product state.'});
    } finally {
      setChangingState(false);
    }
  };

  const handlePayButton = async () => {
    setAskConfirmPayment(false);
    setWillingToPay(true);
    await changeSoldProductState(PaymentState.PENDING);
  };
  const handleInvoiceButton = async () => {
    setWillingToPay(false);
    setOpenSoldProductPDFView(true);
  };

  const openConfirmPay = async (
    payAs: 'WHOLE' | 'SINGLE',
    item?: SoldProduct,
  ) => {
    if (item && item.state === PaymentState.PENDING) {
      await changeSoldProductState(PaymentState.PAID);
      return;
    }
    if (payAs === 'WHOLE') {
      setPayableAmount(
        i.count * (i.product.discountedPrice ?? i.product.basePrice),
      );
    } else if (payAs === 'SINGLE' && item) {
      setPayableAmount(
        (item.product.discountedPrice && item.product.discountedPrice !== 0
          ? item.product.discountedPrice
          : item.product.basePrice) * item.count,
      );
    }
    setAskConfirmPayment(true);
  };

  const handleCloseTabOptions = () => setLongPressActionOpen(false);
  const longPressAction = () => setLongPressActionOpen(true);

  return (
    <LongPressEnabled longPressAction={longPressAction}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.tab.bg,
            paddingVertical: i.state === PaymentState.UNPAID ? 10 : 4,
          },
        ]}>
        <View style={styles.tabInfo}>
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text
                style={[styles.productName, {color: currentTheme.tab.label}]}>
                {i.product.name}
              </Text>
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: currentTheme.baseColor,
                  height: 14,
                  width: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.productName,
                    {
                      color: currentTheme.contrastColor,
                      fontSize: 10,
                    },
                  ]}>
                  {i.count}
                </Text>
              </View>
            </View>
            <Pressable
              style={{
                borderRadius: 100,
                backgroundColor: currentTheme.baseColor,
                height: 16,
                width: 42,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                if (i.state === PaymentState.PENDING) {
                  changeSoldProductState(PaymentState.UNPAID);
                } else if (i.state === PaymentState.UNPAID) {
                  changeSoldProductState(PaymentState.PAID);
                } else if (i.state === PaymentState.PAID) {
                  changeSoldProductState(PaymentState.UNPAID);
                } else {
                  return;
                }
              }}>
              {changingState ? (
                <ActivityIndicator
                  size={10}
                  color={currentTheme.contrastColor}
                />
              ) : (
                <Text
                  style={[
                    styles.productName,
                    {
                      color: currentTheme.contrastColor,
                      fontSize: 8,
                    },
                  ]}>
                  {i.state}
                </Text>
              )}
            </Pressable>
          </View>
          <View style={{gap: 2, justifyContent: 'center'}}>
            <Text
              style={[styles.productAmount, {color: currentTheme.baseColor}]}>
              {`${app.currency} ${
                i.product.discountedPrice && i.product.discountedPrice !== 0
                  ? i.count === 0
                    ? i.product.discountedPrice
                    : (
                        Number(i.product.discountedPrice) * Number(i.count)
                      ).toString()
                  : i.count === 0
                  ? i.product.basePrice
                  : (Number(i.product.basePrice) * Number(i.count)).toString()
              }`}
            </Text>
            {i.product.disabled && (
              <Text
                style={{
                  color: colors.danger,
                  backgroundColor: colors.dangerFade,
                  borderRadius: 3,
                  fontSize: 8,
                  height: 14,
                  textAlign: 'center',
                  padding: 1,
                  fontWeight: '600',
                }}>
                DELETED
              </Text>
            )}
          </View>
        </View>
        {actionType === 'PAID' && (
          <View style={styles.tabActionContainer}>
            <TouchableOpacity
              style={[
                styles.MarkAsPaid,
                {
                  backgroundColor: currentTheme.tab.btnBg,
                  height: 22,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                changeSoldProductState(PaymentState.UNPAID);
              }}>
              {changingState ? (
                <ActivityIndicator
                  size={22}
                  color={currentTheme.contrastColor}
                />
              ) : (
                <Text
                  style={[
                    styles.MarkAsPaidText,
                    {
                      color: currentTheme.tab.text,
                      textAlign: 'center',
                      fontSize: 12,
                    },
                  ]}>
                  {t('c_markasunpaid')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.MarkAsPaid,
                {backgroundColor: currentTheme.tab.btnBg},
              ]}
              activeOpacity={0.8}
              onPress={() => setOpenSoldProductPDFView(true)}>
              <Text
                style={[
                  styles.MarkAsPaidText,
                  {
                    color: currentTheme.tab.text,
                    textAlign: 'center',
                    fontSize: 12,
                  },
                ]}>
                Invoice
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {actionType === 'UNPAID' && (
          <View style={styles.tabActionContainer}>
            <TouchableOpacity
              style={[
                styles.MarkAsPaid,
                {
                  backgroundColor: currentTheme.tab.btnBg,
                  height:
                    i.state === PaymentState.PAID ||
                    i.state === PaymentState.UNPAID
                      ? 34
                      : 22,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => openConfirmPay('SINGLE', i)}>
              {i.state === PaymentState.UNPAID ? (
                <Icon
                  name="qrcode-scan"
                  color={currentTheme.contrastColor}
                  size={20}
                />
              ) : (
                <Text
                  style={[
                    styles.MarkAsPaidText,
                    {
                      color: currentTheme.tab.text,
                      textAlign: 'center',
                      fontSize: 10,
                    },
                  ]}>
                  Recevied?
                </Text>
              )}
            </TouchableOpacity>
            {i.state === PaymentState.PENDING && (
              <TouchableOpacity
                style={[
                  styles.MarkAsPaid,
                  {backgroundColor: currentTheme.tab.btnBg, height: 22},
                ]}
                activeOpacity={0.8}
                onPress={() => setOpenSoldProductPDFView(true)}>
                <Text
                  style={[
                    styles.MarkAsPaidText,
                    {
                      color: currentTheme.tab.text,
                      textAlign: 'center',
                      fontSize: 12,
                    },
                  ]}>
                  Invoice
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <PopupContainer
          open={longPressActionOpen}
          close={() => setLongPressActionOpen(false)}
          padding={true}>
          <TabLongPressOptions
            soldProduct={i}
            customer={customer}
            actionType={actionType}
            date={date}
            close={() => {
              closeParent();
              setLongPressActionOpen(false);
            }}
          />
        </PopupContainer>
      </View>
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
          soldProducts={[i]}
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={willingToPay}
        close={handleCloseQRCode}
        opacity={0.4}
        height={deviceHeight * 0.6}>
        <ScanQRToPay
          payableAmount={payableAmount}
          cancel={handleCloseQRCode}
          currency={currency}
          callback={handleInvoiceButton}
        />
      </SlideUpContainer>
      <SlideUpContainer
        open={openSoldProductPDFView}
        close={handleCloseSoldProductInvoiceViewer}
        height={deviceHeight * 0.5}>
        <InvoicePDFViewer
          soldProducts={[i]}
          customer={i.buyer}
          closeViewer={handleCloseSoldProductInvoiceViewer}
        />
      </SlideUpContainer>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  tabInfo: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'AntDesign',
  },
  productAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabActionContainer: {
    gap: 2,
  },
  MarkAsPaid: {
    height: 26,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  MarkAsPaidText: {
    fontWeight: '600',
  },
  contentToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 20,
  },
  toogletext: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentToggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export {ToogleButton};

export default Tab;
