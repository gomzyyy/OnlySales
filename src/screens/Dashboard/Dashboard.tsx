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
import {Theme} from '../../utils/Constants';
import { prepareNavigation} from '../../utils/nagivationUtils';

const currentTheme = Theme[0];

const Dashboard = () => {
  const [openCreateCustomer, setopenCreateCustomer] = useState<boolean>(false);
  const customers = useSelector(
    (s: RootState) => s.shopkeeper.shopkeeper.customers,
  );
  const searchResults = useSelector(
    (s: RootState) => s.shopkeeper.app.serchResults,
  );

  const handleCloseCreateCustomer = () => setopenCreateCustomer(false);

  const handleOpenCreateCustomer = () => setopenCreateCustomer(true);

  useEffect(() => {
    prepareNavigation();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: currentTheme.bgColor}}>
      {!openCreateCustomer && (
        <CreateButton openCreateCustomer={handleOpenCreateCustomer} />
      )}
      <Header name="Dashboard" menuButton />
      <View style={styles.contentContainer}>
        <View style={{flex: 1}}>
          {customers.length !== 0 ? (
            <>
              <DashboardHeader flex={false} />
              <FlatList
                data={searchResults.length !== 0 ? searchResults : customers}
                keyExtractor={s => s.id.toString()}
                nestedScrollEnabled
                renderItem={({item, index}) => <Tab i={item} />}
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={{flex: 1}}>
              <DashboardHeader searchBar={false} flex={false} />
              <EmptyListMessage />
            </View>
          )}
        </View>
      </View>
      {openCreateCustomer && (
        <SlideupContainer
          open={openCreateCustomer}
          close={handleCloseCreateCustomer}>
          <CreateCustomer callback={handleCloseCreateCustomer} />
        </SlideupContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1, paddingHorizontal: 10},
});

export default Dashboard;
