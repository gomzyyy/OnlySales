import {View, FlatList, StyleSheet, ScrollView} from 'react-native';
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
import {currentTheme} from '../../utils/Constants';
import {prepareNavigation} from '../../utils/nagivationUtils';
import TabLongPressOptions from './components/TabLongPressOptions';
import {Customer} from '../../../types';
import EditCustomer from '../../components/EditCustomer';
import PopupContainer from '../../components/PopUp';

const Dashboard = () => {
  const [openCreateCustomer, setopenCreateCustomer] = useState<boolean>(false);
  const [openTabOptions, setOpenTabOptions] = useState<boolean>(false);
  const [openEditCustomer, setOpenEditCustomer] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  const customers = useSelector(
    (s: RootState) => s.shopkeeper.shopkeeper.customers,
  );
  const handleOpenLongPressOptions = (customer: Customer) => {
    setOpenTabOptions(true);
    setSelectedCustomer(customer);
  };
  const handleCloseLongPressOptions = () => setOpenTabOptions(false);
  const handleOpenEditCustomer = () => {
    setOpenTabOptions(false);
    setOpenEditCustomer(true);
  };
  const handleCloseEditCustomer = () => setOpenEditCustomer(false);
  const handleCloseCreateCustomer = () => setopenCreateCustomer(false);
  const handleOpenCreateCustomer = () => setopenCreateCustomer(true);

  useEffect(() => {
    prepareNavigation();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.contrastColor}}>
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
                data={customers}
                keyExtractor={s => s.id.toString()}
                nestedScrollEnabled
                renderItem={({item}) => (
                  <Tab
                    i={item}
                    handleOpenLongPressOptions={handleOpenLongPressOptions}
                  />
                )}
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
      {openTabOptions && selectedCustomer && (
        <PopupContainer
          open={openTabOptions}
          close={handleCloseLongPressOptions}
          // bgcolor="transparent"
          padding
          >
          <TabLongPressOptions
            triggerEdit={handleOpenEditCustomer}
            i={selectedCustomer}
            close={handleCloseLongPressOptions}
          />
        </PopupContainer>
      )}
      {openEditCustomer && selectedCustomer && (
        <SlideupContainer
          open={openEditCustomer}
          close={handleCloseEditCustomer}
          >
          <EditCustomer i={selectedCustomer} close={handleCloseEditCustomer} />
        </SlideupContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {flex: 1, paddingHorizontal: 10},
});

export default Dashboard;
