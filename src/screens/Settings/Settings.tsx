import {View, StyleSheet, Text, ScrollView} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import Tab from './components/shared/Tab';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import ShopkeeperInfo from './components/ShopkeeperInfo';
import AccountCenter from './components/AccountCenter';

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);

  return (
    <View style={styles.parent}>
      <Header name={shopkeeper.name} backButtom />
      <ScrollView style={styles.settingsContainer} nestedScrollEnabled={true}>
        <View style={styles.infoContainer}>
          <ShopkeeperInfo shopkeeper={shopkeeper} />
        </View>
        <View style={styles.sectionsContainer}>
          <Text style={styles.label}>Account</Text>
         <AccountCenter />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  infoContainer: {},
  settingsContainer: {
    paddingHorizontal: 10,
  },
  sectionsContainer: {
    marginTop: 20,
  },
  label: {fontSize: 30, fontWeight: 'bold', paddingHorizontal:20},
});

export default Settings;
