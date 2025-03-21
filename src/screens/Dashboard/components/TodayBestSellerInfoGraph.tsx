import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {deviceWidth} from '../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {Dataset} from 'react-native-chart-kit/dist/HelperTypes';

type TodayBestSellerInfoGraphProps = {
  pressActions?: () => void;
};

const TodayBestSellerInfoGraph: React.FC<TodayBestSellerInfoGraphProps> = ({
  pressActions = () => {},
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {todaysMostSoldProducts} = useAnalytics();

  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const data: Dataset = {
    data: [
      0,
      todaysMostSoldProducts.length >= 1
        ? todaysMostSoldProducts[0].totalSold *
          (todaysMostSoldProducts[0].discountedPrice ||
            todaysMostSoldProducts[0].basePrice)
        : 0,

      todaysMostSoldProducts.length >= 2
        ? todaysMostSoldProducts[1].totalSold *
          (todaysMostSoldProducts[1].discountedPrice ||
            todaysMostSoldProducts[1].basePrice)
        : 0,

      todaysMostSoldProducts.length >= 3
        ? todaysMostSoldProducts[2].totalSold *
          (todaysMostSoldProducts[2].discountedPrice ||
            todaysMostSoldProducts[2].basePrice)
        : 0,

      todaysMostSoldProducts.length >= 4
        ? todaysMostSoldProducts[3].totalSold *
          (todaysMostSoldProducts[3].discountedPrice ||
            todaysMostSoldProducts[3].basePrice)
        : 0,

      todaysMostSoldProducts.length >= 5
        ? todaysMostSoldProducts[4].totalSold *
          (todaysMostSoldProducts[4].discountedPrice ||
            todaysMostSoldProducts[4].basePrice)
        : 0,
    ].slice(0, todaysMostSoldProducts.length + 1),
    color: opacity => `rgba(0,0,0,${opacity})`,
  };
  return (
    <TouchableOpacity
      style={styles.graphContainer}
      onPress={pressActions}
      activeOpacity={0.8}>
      <LineChart
        data={{
          labels: ['', ...todaysMostSoldProducts.map(s => s.name)],
          datasets: [data],
        }}
        width={deviceWidth - 20}
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
      />
    </TouchableOpacity>
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

export default TodayBestSellerInfoGraph;
