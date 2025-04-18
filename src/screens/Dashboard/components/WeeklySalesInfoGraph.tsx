import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {deviceWidth} from '../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {Dataset} from 'react-native-chart-kit/dist/HelperTypes';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {formatNumber} from '../../../service/fn';

type MonthlySalesInfoGraphProps = {
  pressActions?: () => void;
};

const MonthlySalesInfoGraph: React.FC<MonthlySalesInfoGraphProps> = ({
  pressActions = () => {},
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {weeklySales} = useAnalytics();

  const [tappedIndex, setTappedIndex] = useState<number | undefined>(undefined);

  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const data: Dataset = {
    data: [
      0,
      weeklySales.today.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.yesterday.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.oneDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.twoDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.threeDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.fourDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.fiveDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
    ],
    color: opacity => `rgba(0,0,0,${opacity})`,
  };

  const dotValueOpacity = useSharedValue(1);

  const dotValueOpacityAnimationStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(dotValueOpacity.value, {duration: 600}),
    };
  });

  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDotTap = (index: number) => {
    setTappedIndex(index);
    dotValueOpacity.value = 1;
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(() => (dotValueOpacity.value = 0), 4000);
  };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        maxWidth: deviceWidth * 0.96,
        borderRadius: 10,
        marginTop: 10,
      }}>
      <LineChart
        data={{
          labels: [
            '',
            'Today',
            'Yesterday',
            '3d Ago',
            '4d Ago',
            '5d Ago',
            '6d Ago',
            '7d Ago',
          ],
          datasets: [data],
        }}
        width={Math.max(deviceWidth, data.data.length * 90)}
        height={220}
        yAxisLabel={currency}
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          fillShadowGradient: currentTheme.baseColor,
          fillShadowGradientOpacity: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={{marginVertical: 10, borderRadius: 10}}
        bezier
        onDataPointClick={({index}) => handleDotTap(index)}
        renderDotContent={({index, indexData, x, y}) =>
          index === tappedIndex && (
            <Animated.Text
              key={index}
              style={[
                {
                  position: 'absolute',
                  left: x,
                  top: y - 15,
                  backgroundColor: '#fff',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#000',
                  elevation: 2,
                },
                dotValueOpacityAnimationStyles,
              ]}>
              {indexData === 0
                ? 'N/A'
                : `${currency} ${formatNumber(indexData)}`}
            </Animated.Text>
          )
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  graphContainer: {},
  graphLabel: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default MonthlySalesInfoGraph;
