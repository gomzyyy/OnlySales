import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import {
  Customer,
  Employee,
  Owner,
  Partner,
  SoldProductPaymentHistory,
} from '../../../../../types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {colors, deviceHeight} from '../../../../utils/Constants';

type ConfirmPaymentProps = {
  details: SoldProductPaymentHistory | undefined;
  callback?: () => void;
};

const SoldProductPaymentDetailContainer: React.FC<ConfirmPaymentProps> = ({
  details,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {currency} = useSelector((s: RootState) => s.appData.app);

  const skeletonOpacity = useSharedValue(0.3);
  const deletedTextOpacity = useSharedValue(0);

  useEffect(() => {
    if (!details) {
      skeletonOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, {duration: 500}),
          withTiming(0.3, {duration: 500}),
        ),
        -1,
        true,
      );
    } else {
      if (details.disabled) {
        setTimeout(
          () => (deletedTextOpacity.value = withTiming(1, {duration: 200})),
          200,
        );
      }
    }
  }, [details]);

  const skeletonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skeletonOpacity.value,
  }));
  const deletedTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: deletedTextOpacity.value,
  }));
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      {details && (
        <Animated.Text
          style={[
            {
              position: 'absolute',
              top: 22,
              right: 20,
              fontWeight: '600',
              backgroundColor: colors.dangerFade,
              padding: 4,
              borderRadius: 6,
              color: colors.danger,
            },
            deletedTextAnimatedStyle,
          ]}>
          DELETED
        </Animated.Text>
      )}
      <Text style={[styles.label, {color: currentTheme.baseColor}]}>
        Payment History
      </Text>

      {details ? (
        <View style={styles.detailSection}>
          <Text style={styles.textItem}>
            <Text style={styles.bold}>Product: </Text>
            {details?.info?.name || 'N/A'}
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
        </View>
      ) : (
        <View style={styles.detailSection}>
          {Array.from({length: 6}).map((_, i) => (
            <Animated.View
              key={i}
              style={[styles.skeletonBox, skeletonAnimatedStyle]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.35,
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
