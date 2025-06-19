import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {Customer, SoldProduct} from '../../../../types';
import {deviceHeight} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import {TouchableOpacity} from 'react-native';
import CustomerInfo from './CustomerInfo';
import Tab from './Tab';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';
import FallbackMessage from '../../../components/FallbackMessage';
import Header from '../../../components/Header';

type PaidPaymentsProps = {
  customer: Customer;
  date: string;
  products: SoldProduct[];
  close: () => void;
};

const PaidPayments: React.FC<PaidPaymentsProps> = ({
  customer,
  products,
  date,
  close,
}): React.JSX.Element => {
  console.log(products);
  const {currentTheme} = useTheme();
  const {t} = useTranslation('customer');
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
         <Header
        curved
        headerBgColor={currentTheme.fadeColor}
        name={t('c_paidpayments')}
        titleColor={currentTheme.baseColor}
      />
      <View
        style={[
          styles.container,
          {backgroundColor: currentTheme.contrastColor},
        ]}>
        <CustomerInfo customer={customer} />
        <View style={styles.itemListContainer}>
          {products.length !== 0 ? (
            <FlatList
              data={products}
              keyExtractor={i => i.createdAt}
              renderItem={({item}) => (
                <Tab
                  actionType="PAID"
                  i={item}
                  customer={customer}
                  date={item.createdAt}
                  closeParent={close}
                />
              )}
              nestedScrollEnabled
            />
          ) : (
            <View style={styles.emptyListContainer}>
              <FallbackMessage text={t('p_paidpayments_nodata_title')} />
              <TouchableOpacity
                style={[
                  styles.backBtnContainer,
                  {backgroundColor: currentTheme.fadeColor},
                ]}
                onPress={() => close()}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
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
