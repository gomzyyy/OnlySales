import {View, Text} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-chart-kit';
import {colors, deviceWidth} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

const BreifInfoGraph = () => {
  const {currentTheme} = useTheme();
  const  currency =useSelector((s:RootState)=>s.shopkeeper.app.currency)
  const data:Dataset={data:[42, 113, 72, 91],color:(opacity)=>`rgba(0,0,0,${opacity})`}

  return (
    <View>
      <BarChart
        data={{
          labels: ['This Month', 'Prev Month', 'Q3', 'Q4'],
          datasets: [data],
        }}
        width={deviceWidth - 20}
        height={220}
        yAxisLabel={currency}
        yAxisSuffix="K"
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          fillShadowGradient:  currentTheme.baseColor,
          fillShadowGradientOpacity: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{marginVertical: 10, borderRadius: 10}}
      />
    </View>
  );
};

export default BreifInfoGraph;
