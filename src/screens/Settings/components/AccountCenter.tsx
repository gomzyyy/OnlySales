import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import Tab from './shared/Tab';
import {navigate} from '../../../utils/nagivationUtils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';

const AccountCenterOptions = [
  {title: 'My Profile', navigateTo: 'MyProfile', id: 1},
];

const AccountCenter = () => {
  const handleOnTabPress = (navigateTo: string) => {
    navigate(navigateTo);
  };
  return (
    <View style={styles.accountOptionsContainer}>
      {AccountCenterOptions.map(s => (
        <Tab
          key={s.id}
          title={s.title}
          onPress={() => handleOnTabPress(s.navigateTo)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accountOptionsContainer: {marginTop: 20},
});

export default AccountCenter;
