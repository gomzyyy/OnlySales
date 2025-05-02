import {ScrollView, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {deviceWidth} from '../../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import {Dataset} from 'react-native-chart-kit/dist/HelperTypes';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {formatNumber} from '../../../../service/fn'; // Assuming you have a formatNumber
import {SoldProduct} from '../../../../../types';

type MonthlySalesInfoGraphProps = {
  pressActions?: () => void;
};

const MonthlySalesAnalysisGraph: React.FC<MonthlySalesInfoGraphProps> = ({
  pressActions = () => {},
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {soldThisMonth, soldLastMonth, soldOneMonthAgo, soldTwoMonthAgo} =
    useAnalytics();
  const {currency} = useSelector((s: RootState) => s.appData.app);

  const calculateTotal = (sales: SoldProduct[]) => {
    return sales.reduce((sum, item) => {
      const totalSold = Number(item.product.totalSold) || 0;
      const price = item.product.discountedPrice ?? item.product.basePrice;

      const validPrice = price ? Number(price) : 0;
      console.log(
        `Total Sold: ${totalSold}, Price: ${validPrice}, Total: ${
          totalSold * validPrice
        }`,
      );
      return sum + totalSold * validPrice;
    }, 0);
  };

  const graphData: Dataset = {
    data: [
      0,
      calculateTotal(soldThisMonth),
      calculateTotal(soldLastMonth),
      calculateTotal(soldOneMonthAgo),
      calculateTotal(soldTwoMonthAgo),
    ],
    color: opacity => `rgba(0,0,0,${opacity})`,
  };

  const labels = ['', 'this month', 'last month', '2mo ago', '3mo ago'];

  const [tappedIndex, setTappedIndex] = useState<number | undefined>(undefined);
  const dotValueOpacity = useSharedValue(1);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dotValueOpacityAnimationStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(dotValueOpacity.value, {duration: 600}),
    };
  });

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
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        maxWidth: deviceWidth * 0.96,
        borderRadius: 10,
        marginTop: 10,
      }}>
      <LineChart
        data={{
          labels: labels,
          datasets: [graphData],
        }}
        width={Math.max(deviceWidth, graphData.data.length * 90)}
        height={220}
        yAxisLabel={currency}
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: currentTheme.bgColor,
          backgroundGradientTo: currentTheme.bgColor,
          fillShadowGradient: currentTheme.baseColor,
          fillShadowGradientOpacity: 1,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          barPercentage: 0.5,
        }}
        bezier
        style={{borderRadius: 10}}
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
});

export default MonthlySalesAnalysisGraph;
