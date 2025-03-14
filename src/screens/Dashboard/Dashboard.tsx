import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../../components/Header';
import DashboardHeader from '../../components/DashboardHeader';
import {prepareNavigation} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';
import PressableContainer from './components/PressableContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../utils/Constants';
import BreifInfoGraph from './components/BreifInfoGraph';

const DashboardOptions = [
  {
    id: 0,
    title: 'Customers',
    navigateTo: 'Customers',
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
            <BreifInfoGraph />
            <BreifInfoGraph />
            <BreifInfoGraph />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
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
    marginTop: 5,
  },
});

export default Dashboard;
