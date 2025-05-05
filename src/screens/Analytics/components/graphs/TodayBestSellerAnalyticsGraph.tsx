import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
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
import {formatNumber} from '../../../../service/fn';
import {SoldProduct} from '../../../../../types';

type TodayBestSellerInfoGraphProps = {
  pressActions?: () => void;
};

const TodayBestSellerAnalyticsGraph: React.FC<
  TodayBestSellerInfoGraphProps
> = ({pressActions = () => {}}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {todaysMostSoldProducts} = useAnalytics();
  const currency = useSelector((s: RootState) => s.appData.app.currency);

  const [tappedIndex, setTappedIndex] = useState<number | undefined>(undefined);

  const calculatePrice = (item: SoldProduct) => {
    const totalSold = item.count;
    const price = Number(
      item.product.discountedPrice ?? item.product.basePrice ?? 0,
    );
    return totalSold * price;
  };

  const aggregatedProducts = useMemo(() => {
    const grouped: Record<string, any> = {};

    todaysMostSoldProducts.forEach(item => {
      const productId = item.product._id;
      if (grouped[productId]) {
        grouped[productId].count += item.count;
        grouped[productId].totalSold += item.product.totalSold;
      } else {
        grouped[productId] = {
          ...item,
          count: item.count,
          totalSold: item.product.totalSold,
        };
      }
    });

    return Object.values(grouped);
  }, [todaysMostSoldProducts]);

  const prices = aggregatedProducts.slice(0, 5).map(calculatePrice);
  const labels = aggregatedProducts.slice(0, 5).map(item => item.product.name);

  const data: Dataset = {
    data: [0, ...prices] as number[],
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
          labels: ['', ...labels],
          datasets: [data],
        }}
        width={Math.max(deviceWidth, data.data.length * 70)}
        height={220}
        yAxisLabel={currency}
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: currentTheme.bgColor,
          backgroundGradientTo: currentTheme.bgColor,
          fillShadowGradient: currentTheme.baseColor,
          fillShadowGradientOpacity: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={{borderRadius: 10}}
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

export default TodayBestSellerAnalyticsGraph;
