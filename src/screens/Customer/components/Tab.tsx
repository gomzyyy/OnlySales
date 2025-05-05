import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Customer, SoldProduct} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import TabLongPressOptions from './TabLongPressOptions';
import PopupContainer from '../../../components/PopUp';
import {useTheme} from '../../../hooks/index';
import {useTranslation} from 'react-i18next';
import {colors, deviceHeight} from '../../../utils/Constants';
import SlideUpContainer from '../../../components/SlideUpContainer';
import ConfirmPayment from '../../../components/ConfirmPayment';
import ScanQRToPay from '../../../components/ScanQRToPay';
import {updateSoldProductStateAPI} from '../../../api/api.soldproduct';
import {PaymentState} from '../../../../enums';
import PDFPreViewer from '../../PDFViewer/components/PDFPreViewer';
import InvoicePDFViewer from '../../PDFViewer/InvoicePDFViewer';

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
  onPay,
  date,
  closeParent,
}): React.JSX.Element => {
  const {t} = useTranslation('customer');
  const {currentTheme} = useTheme();
  const app = useSelector((s: RootState) => s.appData.app);
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const [askConfirmPayment, setAskConfirmPayment] = useState<boolean>(false);
  const [willingToPay, setWillingToPay] = useState<boolean>(false);
  const [openSINGLESoldProductPDFView, setOpenSINGLESoldProductPDFView] =
    useState<boolean>(false);

  const [longPressActionOpen, setLongPressActionOpen] =
    useState<boolean>(false);
  const handleCloseConfirmPayment = () => {
    setAskConfirmPayment(false);
  };
  const handleCloseQRCode = () => {
    setWillingToPay(false);
  };
  const handleCloseSINGLESoldProductViewer = () => {
    setOpenSINGLESoldProductPDFView(false);
  };

  const handlePayButton = async () => {
    setAskConfirmPayment(false);
    setWillingToPay(true);
      await updateSoldProductStateAPI({
        query: {
          role: user.role,
          updatedState: PaymentState.PENDING,
        },
        body: {
          soldProducts: [i],
        },
      });
  };
  const handleInvoiceButton = () => {
    setWillingToPay(false);
    setOpenSINGLESoldProductPDFView(true);
  };

  const openConfirmPay = (payAs: 'WHOLE' | 'SINGLE', item?: SoldProduct) => {
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

  const handleMarkAs = async () => {
    if (actionType === 'PAID') {
      // dispatch(setToUnpaid({customer, product: i}));
      return;
    } else if (actionType === 'UNPAID') {
      // dispatch(setToPaid({customer, product: i}));
      return;
    } else {
      return;
    }
  };

  return (
    <LongPressEnabled longPressAction={longPressAction}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.tab.bg,
          },
        ]}>
        <View style={styles.tabInfo}>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <Text
              style={[styles.customerName, {color: currentTheme.tab.label}]}>
              {i.product.name} {`x${i.count}`}
            </Text>
            {i.product.disabled && (
              <Text
                style={{
                  color: colors.danger,
                  backgroundColor: colors.dangerFade,
                  padding: 3,
                  borderRadius: 6,
                  fontSize: 10,
                }}>
                DELETED
              </Text>
            )}
            {actionType === 'PAID' && (
              <View
                style={[
                  styles.MarkAsPaid,
                  {backgroundColor: currentTheme.contrastColor},
                ]}>
                <Text
                  style={[
                    styles.MarkAsPaidText,
                    {color: currentTheme.tab.label},
                  ]}>
                  {t('c_paid_flag')}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.productAmount, {color: currentTheme.baseColor}]}>
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
        </View>
        {actionType === 'PAID' && (
          <View style={styles.tabActionContainer}>
            <TouchableOpacity
              style={[
                styles.MarkAsPaid,
                {backgroundColor: currentTheme.tab.btnBg},
              ]}
              activeOpacity={0.8}
              onPress={handleMarkAs}>
              <Text
                style={[styles.MarkAsPaidText, {color: currentTheme.tab.text}]}>
                {t('c_markasunpaid')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {actionType === 'UNPAID' && (
          <View style={styles.tabActionContainer}>
            <TouchableOpacity
              style={[
                styles.MarkAsPaid,
                {backgroundColor: currentTheme.tab.btnBg},
              ]}
              activeOpacity={0.8}
              onPress={() => openConfirmPay('SINGLE', i)}>
              <Text
                style={[styles.MarkAsPaidText, {color: currentTheme.tab.text}]}>
                {t('c_pay_btn')}
              </Text>
            </TouchableOpacity>
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
        open={openSINGLESoldProductPDFView}
        close={handleCloseSINGLESoldProductViewer}
        height={deviceHeight * 0.5}>
        <InvoicePDFViewer soldProducts={[i]} customer={i.buyer} />
      </SlideUpContainer>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 10,
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
    paddingHorizontal: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '400',
  },
  productAmount: {
    fontSize: 20,
  },
  tabActionContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  MarkAsPaid: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  MarkAsPaidText: {
    fontWeight: '600',
    fontSize: 18,
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
