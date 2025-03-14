import {View, Text, Dimensions, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {
  BarChart,
  PieChart,
  LineChart,
  ProgressChart,
  StackedBarChart,
} from 'react-native-chart-kit';
import {RequestMediaPermissions} from '../../service/permissions';

const Test = () => {
  const data = [
    {
      name: 'Q1',
      population: 40,
      color: '#ff5733',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Q2',
      population: 50,
      color: '#33ff57',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Q3',
      population: 70,
      color: '#3357ff',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Q4',
      population: 90,
      color: '#f0f',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
  ];
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{gap: 60}}>
        <BarChart
          data={{
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{data: [40, 50, 70, 90]}],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            fillShadowGradient: '#ff5733',
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{marginVertical: 10, borderRadius: 10}}
        />
        <ProgressChart
          data={{
            data: [0.4, 0.6, 0.8], // Values must be between 0 and 1
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            fillShadowGradient: '#ff5733',
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(14, 124, 174, ${opacity})`,
          }}
          style={{marginVertical: 10, borderRadius: 10}}
        />
        <LineChart
          data={{
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{data: [40, 50, 70, 90]}],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            fillShadowGradient: '#ff5733',
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{marginVertical: 10, borderRadius: 10}}
        />
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </ScrollView>
    </View>
  );
};

export default Test;
