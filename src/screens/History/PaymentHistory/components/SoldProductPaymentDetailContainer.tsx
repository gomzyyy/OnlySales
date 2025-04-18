import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import { Customer, Employee, Owner, Partner, SoldProductPaymentHistory } from '../../../../../types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { deviceHeight } from '../../../../utils/Constants';

type ConfirmPaymentProps = {
  details: SoldProductPaymentHistory | undefined;
  callback?: () => void;
};

const SoldProductPaymentDetailContainer: React.FC<ConfirmPaymentProps> = ({
  details,
}): React.JSX.Element => {
  const { currentTheme } = useTheme();
  const { currency } = useSelector((s: RootState) => s.appData.app);

  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (!details) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        true
      );
    }
  }, [details]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      style={[styles.parent, { backgroundColor: currentTheme.contrastColor }]}
    >
      <Text style={[styles.label, { color: currentTheme.baseColor }]}>
        Payment History
      </Text>

      {details ? (
        <View style={styles.detailSection}>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Product: </Text>
            {details.info.name}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Amount: </Text>
            {currency} {details.info.amount}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Description: </Text>
            {details.paymentDescription}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Date: </Text>
            {new Date(details.createdAt).toDateString()}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Sold By: </Text>
            {(details.reference.soldBy as Owner | Employee | Partner).name ||
              'N/A'}
          </Text>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Buyer: </Text>
            {(details.reference.buyer as Customer).name || 'N/A'}
          </Text>
        </View>
      ) : (
        <View style={styles.detailSection}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Animated.View key={i} style={[styles.skeletonBox, animatedStyle]} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight*0.35,
    marginBottom: 10,
    borderRadius: 20,
    padding: 20,
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailSection: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  textItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
  skeletonBox: {
    height: 18,
    backgroundColor: '#ccc',
    borderRadius: 4,
    width: '95%',
    alignSelf: 'center',
  },
});

export default SoldProductPaymentDetailContainer;
