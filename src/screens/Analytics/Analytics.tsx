import {View, StyleSheet, ScrollView, Image} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import {useAnalytics, useTheme} from '../../hooks';
import TodayAnalyticsCard from './components/TodayAnalyticsCard';
import WeeklySalesAnalysisCard from './components/WeeklySalesAnalysisCard';
import MonthlySalesAnalysisCard from './components/MonthlySalesAnalyticsCard';
import {analyseBusinessAIAPI} from '../../api/api.ai';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {AIResponseLengthType} from '../../../enums';
import HeaderIcon from '../../components/HeaderIcon';
const COHERE_LOGO = require('../../assets/images/Cohere-Logo0.png');

const Analytics = () => {
  const {currentTheme} = useTheme();
  const {mergedweeklySales, soldThisMonth, _id} = useAnalytics();
  const user = useSelector((s: RootState) => s.appData.user);
  if (!user) {
    return null;
  }
  const [loading, setLoading] = useState<boolean>(false);

  const getBusinessAnalytics = async () => {
    const res = await analyseBusinessAIAPI(
      {query: {role: user.role, oid: _id, rl: AIResponseLengthType.lg}},
      setLoading,
    );
    console.log(res);
  };

  const AIbtn = () => (
    <View>
      <Image source={COHERE_LOGO} style={{height: 20, width: 20}} />
    </View>
  );

  return (
    <View style={[styles.parent, {backgroundColor: currentTheme.baseColor}]}>
      <Header
        titleColor={currentTheme.header.textColor}
        name="Analytics"
        headerBgColor={currentTheme.baseColor}
        backButton={true}
        renderItem={
          <HeaderIcon label='Analyse'>
            <AIbtn />
          </HeaderIcon>
        }
        customAction={getBusinessAnalytics}
        customComponent={true}
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
