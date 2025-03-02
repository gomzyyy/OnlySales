import {View, StyleSheet} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import Tab from './components/Tab';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import ShopkeeperInfo from './components/ShopkeeperInfo';
import {Picker} from '@react-native-picker/picker';
import {currentTheme} from '../../utils/Constants';
import {setTheme} from '../../../store/slices/shopkeeper';
import {AppThemeName} from '../../../enums';
const NoPhoto = require('../../assets/images/no-profile.jpg');

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);
  const app = useSelector((s: RootState) => s.shopkeeper.app);

  return (
    <View style={styles.parent}>
      <Header name={shopkeeper.name} backButtom />
      <View style={styles.settingsContainer}>
        <View style={styles.infoContainer}>
          <ShopkeeperInfo shopkeeper={shopkeeper} />
        </View>
        {/* <View style={styles.innerContainer}>
          <Text style={styles.label}>App</Text>
          <Tab title="App" />
        </View> */}
        <Picker
          style={styles.dropdown}
          selectedValue={app.currentTheme}
          onValueChange={(value: AppThemeName) => dispatch(setTheme(value))}
          dropdownIconColor={currentTheme.modal.pickerText}>
          <Picker.Item
            label={AppThemeName.PURPLE}
            value={AppThemeName.PURPLE}
          />
          <Picker.Item
            label={AppThemeName.YELLOW}
            value={AppThemeName.YELLOW}
          />
          <Picker.Item label={AppThemeName.RED} value={AppThemeName.RED} />
          <Picker.Item label={AppThemeName.GREEN} value={AppThemeName.GREEN} />
          <Picker.Item label={AppThemeName.BLUE} value={AppThemeName.BLUE} />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  infoContainer: {},
  settingsContainer: {
    paddingHorizontal: 10,
  },
  imageContainer: {
    height: 60,
    width: 60,
  },
  image: {
    height: '100%',
    width: 'auto',
  },
  innerContainer: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dropdown: {
    marginTop: 40,
    color: currentTheme.modal.pickerText,
    backgroundColor: currentTheme.modal.pickerbg,
  },
});

export default Settings;
