import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import {useAnalytics, useTheme} from '../../hooks';
import Icon from 'react-native-vector-icons/Entypo';
import TodayAnalyticsCard from './components/TodayAnalyticsCard';
import WeeklySalesAnalysisCard from './components/WeeklySalesAnalysisCard';
import MonthlySalesAnalysisCard from './components/MonthlySalesAnalyticsCard';
const NoProductImage = require('../../assets/images/no_product_image.jpg');
const NoUserImage = require('../../assets/image/no-profile.jpg');

const Analytics = () => {
  const {currentTheme} = useTheme();
  const {mergedweeklySales,soldThisMonth} = useAnalytics();
  return (
    <View style={[styles.parent, {backgroundColor: currentTheme.baseColor}]}>
      <Header
        titleColor={currentTheme.header.textColor}
        name="Analytics"
        headerBgColor={currentTheme.baseColor}
        backButtom={true}
      />
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 90, gap: 20}}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <TodayAnalyticsCard />
          <WeeklySalesAnalysisCard weeklySales={mergedweeklySales} />
          <MonthlySalesAnalysisCard monthlySales={soldThisMonth} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  graphContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  graphLabel: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Analytics;

{
  /* <View style={styles.graphContainer}>
          <Text
            style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
            {t('d_todaybestseller_title')}
          </Text>
          <TodayBestSellerInfoGraph />
        </View>
        <View style={styles.graphContainer}>
          <Text
            style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
            {t('d_weeklysalesinfograph_title')}
          </Text>
          <WeeklySalesInfoGraph />
        </View> */
}
