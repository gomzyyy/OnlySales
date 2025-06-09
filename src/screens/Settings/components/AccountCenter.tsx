import {View, StyleSheet} from 'react-native';
import React from 'react';
import Tab from './shared/Tab';
import {navigate} from '../../../utils/nagivationUtils';

const AccountCenterOptions = [
  {
    title: 'My Profile',
    navigateTo: 'MyProfile',
    id: 1,
    description:'user name, phone number, email, role, and more.',
  },
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
          description={s.description}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accountOptionsContainer: {marginTop: 20},
});

export default AccountCenter;
