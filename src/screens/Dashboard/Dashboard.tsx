import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../../components/Header';
import DashboardHeader from '../../components/DashboardHeader';
import {prepareNavigation} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';
import PressableContainer from './components/PressableContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import WeeklySalesInfoGraph from './components/WeeklySalesInfoGraph';
import TodayBestSellerInfoGraph from './components/TodayBestSellerInfoGraph';

const DashboardOptions = [
  {
    id: 0,
    title: 'Employees',
    navigateTo: 'Employees',
    icon: (color: string) => (
      <Icon name="people-sharp" size={24} color={color} />
    ),
  },
  {
    id: 1,
    title: 'Analytics',
    navigateTo: 'Analytics',
    icon: (color: string) => <Icon2 name="analytics" size={24} color={color} />,
  },
];

const Dashboard = () => {
  const {currentTheme} = useTheme();
  useEffect(() => {
    prepareNavigation();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.baseColor}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Header
          name="Dashboard"
          menuButton
          titleColor={currentTheme.header.textColor}
        />
        <View style={styles.contentContainer}>
          <DashboardHeader flex={false} />
          <View style={{paddingHorizontal: 10}}>
            <View
              style={{
                backgroundColor: currentTheme.contrastColor,
                paddingBottom: 10,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}>
              <View style={styles.navigationBtnsContainer}>
                {DashboardOptions.map(s => (
                  <PressableContainer
                    navigateTo={s.navigateTo}
                    title={s.title}
                    key={s.id}>
                    {s.icon(currentTheme.header.textColor)}
                  </PressableContainer>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.graphContainer}>
            <Text
              style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
              Today's best-sellers {'(sales-product)'}
            </Text>
            <TodayBestSellerInfoGraph />
          </View>
          <View style={styles.graphContainer}>
            <Text
              style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
              Past 7 Day Recap {'(sales-day)'}
            </Text>
            <WeeklySalesInfoGraph />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  navigationBtnsContainer: {
    alignItems: 'flex-start',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 10,
  },
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

export default Dashboard;
