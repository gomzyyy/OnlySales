import {View, Text, ScrollView, FlatList} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import Header from '../../components/Header';
import {d} from '../../../_data/dummy_data';
import DashboardHeader from '../../components/DashboardHeader';
import Tab from './components/Tab';
import {RootState} from '../../../store/store';
import {useSelector} from 'react-redux';
import CreateButton from '../../components/CreateButton';
import CreateCustomer from '../../components/CreateCustomer';

const Dashboard = () => {
  const [openCreateCustomer, setopenCreateCustomer] = useState<boolean>(false);
  const state = useSelector((s: RootState) => s.shopkeeper);
  const searchResults = state.app.serchResults;
  const c = d.customers;

  const handleCloseCreateCustomer = () => setopenCreateCustomer(false);

  const handleOpenCreateCustomer = () => setopenCreateCustomer(true);

  return (
    <View style={{flex: 1}}>
      <CreateButton openCreateCustomer={handleOpenCreateCustomer} />
      <Header name="Dashboard" />
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View style={{flex: 1}}>
          {c.length === 0 ? (
            <FlatList
              data={searchResults.length !== 0 ? searchResults : c}
              ListHeaderComponent={DashboardHeader}
              keyExtractor={s => s.id.toString()}
              nestedScrollEnabled
              renderItem={({item}) => <Tab i={item} />}
            />
          ) : (
            <View style={{flex: 1}}>
              <DashboardHeader searchBar={false} flex={false} />
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 20,
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}>
                  Hurray! No Udhars.
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 20,
                    fontSize: 24,
                    fontWeight: '400',
                    paddingHorizontal: 20,
                  }}>
                  Click on create button to create Udhar.
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <CreateCustomer
        open={openCreateCustomer}
        close={handleCloseCreateCustomer}
      />
    </View>
  );
};

export default Dashboard;
