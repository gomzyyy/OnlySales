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

  const calculatePrice = (item: any) => {
    const totalSold = Number(item?.product?.totalSold ?? 0);
    const price = Number(
      item?.product?.discounterPrice ?? item?.product?.basePrice ?? 0,
    );
    return totalSold * price;
  };

  const prices = todaysMostSoldProducts.slice(0, 5).map(calculatePrice);
  const labels = todaysMostSoldProducts
    .slice(0, 5)
    .map(item => item.product.name);

  const data: Dataset = {
    data: [0, ...prices] as number[],
    color: opacity => `rgba(0,0,0,${opacity})`,
  };

  return (
    <TouchableOpacity
      style={styles.graphContainer}
      onPress={pressActions}
      activeOpacity={0.8}>
      <LineChart
        data={{
          labels: ['', ...labels],
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
        bezier
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
