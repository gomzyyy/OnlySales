import {View, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import DashboardHeader from '../../components/DashboardHeader';
import Tab from './components/Tab';
import {RootState} from '../../../store/store';
import {useSelector} from 'react-redux';
import CreateButton from '../../components/CreateButton';
import SlideupContainer from '../../components/SlideUpContainer';
import CreateCustomer from '../../components/CreateCustomer';
import EmptyListMessage from './components/EmptyListMessage';
import {prepareNavigation} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';
import Customers from '../Customers/Customers';

const Dashboard = () => {
  const {currentTheme} = useTheme();
  const [openCreateCustomer, setopenCreateCustomer] = useState<boolean>(false);

  const customers = useSelector(
    (s: RootState) => s.shopkeeper.shopkeeper.customers,
  );
  const handleCloseCreateCustomer = () => setopenCreateCustomer(false);
  const handleOpenCreateCustomer = () => setopenCreateCustomer(true);

  useEffect(() => {
    prepareNavigation();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.baseColor}}>
      <Header name="Dashboard" menuButton />
      <View style={styles.contentContainer}>
        {/* <View style={{flex: 1}}> */}
          <DashboardHeader flex={false} />
          <View
            style={{
              flex: 1,
              backgroundColor: currentTheme.contrastColor,
            }}></View>
        {/* </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1},
});

export default Dashboard;
