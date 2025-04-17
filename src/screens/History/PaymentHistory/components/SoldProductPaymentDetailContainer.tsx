import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors, deviceHeight} from '../../../../utils/Constants';
import {useTheme} from '../../../../hooks';
import {
  Customer,
  Employee,
  Owner,
  Partner,
  SoldProductPaymentHistory,
} from '../../../../../types';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';

type ConfirmPaymentProps = {
  details: SoldProductPaymentHistory | undefined;
  callback?: () => void;
};

const SoldProductPaymentDetailContainer: React.FC<ConfirmPaymentProps> = ({
  details,
  callback,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {currency} = useSelector((s: RootState) => s.appData.app);

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={[styles.label, {color: currentTheme.baseColor}]}>
        Payment History
      </Text>

      {details ? (
        <View style={styles.detailSection}>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Product:</Text> {details.info.name}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Amount:</Text> {currency}{' '}
            {details.info.amount}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Description:</Text>{' '}
            {details.paymentDescription}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Date:</Text>{' '}
            {new Date(details.createdAt).toDateString()}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Sold By:</Text>{' '}
            {(details.reference.soldBy as Owner | Employee | Partner).name ||
              'N/A'}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Buyer:</Text>{' '}
            {(details.reference.buyer as Customer).name || 'N/A'}
          </Text>
        </View>
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
    height: deviceHeight * 0.3,
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

export default SoldProductPaymentDetailContainer;
