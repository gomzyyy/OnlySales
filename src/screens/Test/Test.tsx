import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-chart-kit'

const Test = () => {
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <BarChart
      data={{
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [{ data: [40, 50, 70, 90] }],
      }}
      width={Dimensions.get("window").width - 20}
      height={220}
      yAxisLabel="$"
      yAxisSuffix=''
      chartConfig={{
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        fillShadowGradient: "#ff5733",
        fillShadowGradientOpacity: 1,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      style={{ marginVertical: 10, borderRadius: 10 }}
    />
    </View>
  )
}

export default Test