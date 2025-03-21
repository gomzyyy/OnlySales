import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Customer, SoldProduct} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import TabLongPressOptions from './TabLongPressOptions';
import PopupContainer from '../../../components/PopUp';
import {useTheme} from '../../../hooks/index';
import {setToPaid, setToUnpaid} from '../../../../store/slices/business';

type TabProps = {
  i: SoldProduct;
  lastIndex?: boolean;
  customer: Customer;
  actionType: 'PAID' | 'UNPAID';
  dummy?: boolean;
  onPay?: () => void;
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
  onPay
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const app = useSelector((s: RootState) => s.appData.app);

  const [longPressActionOpen, setLongPressActionOpen] =
    useState<boolean>(false);

  const handleCloseTabOptions = () => setLongPressActionOpen(false);
  const longPressAction = () => setLongPressActionOpen(true);

  const handleMarkAs = async () => {
    if (actionType === 'PAID') {
      dispatch(setToUnpaid({customer, product: i}));
      return;
    } else if (actionType === 'UNPAID') {
      dispatch(setToPaid({customer, product: i}));
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
          <View style={{flexDirection: 'row', gap: 4}}>
            <Text
              style={[styles.customerName, {color: currentTheme.tab.label}]}>
              {i.name} {`x${i.count}`}
            </Text>
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
                  Paid
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.productAmount, {color: currentTheme.baseColor}]}>
            {`${app.currency} ${
              i.discountedPrice && i.discountedPrice !== 0
                ? i.count === 0
                  ? i.discountedPrice
                  : (Number(i.discountedPrice) * Number(i.count)).toString()
                : i.count === 0
                ? i.basePrice
                : (Number(i.basePrice) * Number(i.count)).toString()
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
                {'Mark as *Unpaid'}
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
              onPress={() => onPay && onPay()}>
              <Text
                style={[styles.MarkAsPaidText, {color: currentTheme.tab.text}]}>
                {'Pay'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <PopupContainer
          open={longPressActionOpen}
          close={() => setLongPressActionOpen(false)}
          padding={true}>
          <TabLongPressOptions
            product={i}
            customer={customer}
            close={handleCloseTabOptions}
            actionType={actionType}
          />
        </PopupContainer>
      </View>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
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
    fontSize: 20,
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
    fontSize: 20,
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
