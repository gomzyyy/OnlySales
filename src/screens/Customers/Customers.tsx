import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import EmptyListMessage from './components/EmptyListMessage';
import SlideUpContainer from '../../components/SlideUpContainer';
import CreateCustomer from '../../components/CreateCustomer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from './components/Tab';
import CreateButton from '../../components/CreateButton';
import SearchBar from './components/SearchBar';

const Customers = () => {
  const [openCreateCustomer, setopenCreateCustomer] = useState<boolean>(false);

  const customers = useSelector(
    (s: RootState) => s.shopkeeper.shopkeeper.customers,
  );
  const handleCloseCreateCustomer = () => setopenCreateCustomer(false);
  const handleOpenCreateCustomer = () => setopenCreateCustomer(true);
  return (
    <>
      <View style={styles.contentContainer}>
        {!openCreateCustomer && (
          <CreateButton openCreateCustomer={handleOpenCreateCustomer} />
        )}
        <View style={{flex: 1}}>
          <View style={styles.searchBarContainer}>
            <SearchBar />
          </View>
          {customers.length !== 0 ? (
            <FlatList
              data={customers}
              keyExtractor={s => s.id.toString()}
              nestedScrollEnabled
              renderItem={({item}) => <Tab i={item} />}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{flex: 1}}>
              <DashboardHeader searchBar={false} flex={false} />
              <EmptyListMessage />
            </View>
          )}
        </View>
      </View>
      {openCreateCustomer && (
        <SlideUpContainer
          open={openCreateCustomer}
          close={handleCloseCreateCustomer}>
          <CreateCustomer callback={handleCloseCreateCustomer} />
        </SlideUpContainer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  searchBarContainer:{paddingVertical:20},
  contentContainer: {flex: 1, paddingHorizontal: 10},
});

export default Customers;
