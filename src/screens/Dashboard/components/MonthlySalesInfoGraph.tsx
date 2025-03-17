import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-chart-kit';
import {deviceWidth} from '../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {Dataset} from 'react-native-chart-kit/dist/HelperTypes';

type MonthlySalesInfoGraphProps = {
  pressActions?: () => void;
};

const MonthlySalesInfoGraph: React.FC<MonthlySalesInfoGraphProps> = ({
  pressActions = () => {},
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {soldThisMonth, soldLastMonth, soldOneMonthAgo, soldTwoMonthAgo} =
    useAnalytics();
  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const data: Dataset = {
    data: [
      0,
      soldThisMonth.reduce(
        (arr, curr) =>
          arr + curr.totalSold * (curr.discountedPrice ?? curr.basePrice),
        0,
      ),
      soldLastMonth.reduce(
        (arr, curr) =>
          arr + curr.totalSold * (curr.discountedPrice ?? curr.basePrice),
        0,
      ),
      soldOneMonthAgo.reduce(
        (arr, curr) =>
          arr + curr.totalSold * (curr.discountedPrice ?? curr.basePrice),
        0,
      ),
      soldTwoMonthAgo.reduce(
        (arr, curr) =>
          arr + curr.totalSold * (curr.discountedPrice ?? curr.basePrice),
        0,
      ),
    ],
    color: opacity => `rgba(0,0,0,${opacity})`,
  };

  return (
    <TouchableOpacity
      style={styles.graphContainer}
      onPress={pressActions}
      activeOpacity={0.8}>
      <LineChart
        data={{
          labels: ['', 'curr month', 'prev month', '1mo ago', '2mo ago'],
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

export default MonthlySalesInfoGraph;
