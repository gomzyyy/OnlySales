import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {UnknownPaymentHistory} from '../../../../../types';
import {PaymentState} from '../../../../../enums';
import {useTheme} from '../../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import {deviceHeight} from '../../../../utils/Constants';

type Props = {
  details: UnknownPaymentHistory | undefined;
};

const getBannerColor = (state: PaymentState): string => {
  switch (state) {
    case PaymentState.PAID:
      return '#4CAF50'; // green
    case PaymentState.UNPAID:
      return '#F44336'; // red
    case PaymentState.PENDING:
      return '#FFC107'; // yellow
    default:
      return '#ccc';
  }
};

const UnknownPaymentHistoryContainer: React.FC<Props> = ({details}) => {
  const {currentTheme} = useTheme();
  const {currency} = useSelector((s: RootState) => s.appData.app);

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={[styles.label, {color: currentTheme.baseColor}]}>
        Payment Info
      </Text>

      {details ? (
        <>
          <View
            style={[
              styles.banner,
              {backgroundColor: getBannerColor(details.state)},
            ]}>
            <Text style={styles.bannerText}>{details.state}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>Type:</Text> {details.type}
            </Text>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>Description:</Text>{' '}
              {details.paymentDescription}
            </Text>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>From:</Text>{' '}
              {details.details.from?.name || 'N/A'}
            </Text>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>To:</Text>{' '}
              {details.details.to?.name || 'N/A'}
            </Text>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>Item:</Text>{' '}
              {details.payments.items?.name1 || 'N/A'}
            </Text>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>Amount:</Text> {currency}{' '}
              {details.payments.items?.price || 0}
            </Text>
            <Text style={styles.textItem}>
              <Text style={styles.bold}>Qty:</Text>{' '}
              {details.payments.items?.quantity || 0}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.loader}>
          <ActivityIndicator
            size={40}
            color={currentTheme.baseColor}
            style={{marginBottom: 40}}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.4,
    marginBottom: 10,
    borderRadius: 20,
    padding: 20,
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  banner: {
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailSection: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  textItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UnknownPaymentHistoryContainer;
