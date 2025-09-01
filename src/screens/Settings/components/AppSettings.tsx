import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Tab from './shared/Tab';
import {navigate} from '../../../utils/nagivationUtils';
import SlideUpContainer from '../../../components/SlideUpContainer';
import OpenClose from '../screens/OpenClose';
import { deviceHeight } from '../../../utils/Constants';

const AppSettings = () => {
  const [openBusinessTimings, setOpenBusinessTimings] =
    useState<boolean>(false);
  const handleOpenBT = () => setOpenBusinessTimings(true);
  const handleCloseBT = () => setOpenBusinessTimings(false);
  const AppSettingsOptions = [
    {
      title: 'App Lock',
      navigateTo: 'SetPasscode',
      id: 1,
      description:
        'lock your business app and never let unknown users to access your business.',
      onPress: undefined,
    },
    {
      title: 'Opening and closing',
      navigateTo: undefined,
      id: 2,
      description: 'choose time slots | Manage holidays',
      onPress: handleOpenBT,
    },
    {
      title: 'App Info',
      navigateTo: 'AppInfo',
      id: 3,
      description:
        'version, properties, accessibility, support; know your app better.',
      onPress: undefined,
    },
  ];

  return (
    <View style={styles.accountOptionsContainer}>
      {AppSettingsOptions.map(s => (
        <Tab
          key={s.id}
          title={s.title}
          onPressNavigate={() => {
            if (s.navigateTo && typeof s.navigateTo === 'string') {
              navigate(`${s.navigateTo}`);
            } else return;
          }}
          onPress={s.onPress}
          description={s.description}
        />
      ))}
      <SlideUpContainer
        open={openBusinessTimings}
        close={handleCloseBT}
        usepadding={false}
        height={deviceHeight * 0.7}>
        <OpenClose />
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  accountOptionsContainer: {marginTop: 20},
});

export default AppSettings;
