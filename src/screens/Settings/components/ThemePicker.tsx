import {StyleSheet} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {Picker} from '@react-native-picker/picker';
import {AppThemeName} from '../../../../enums';
import {AppTheme} from '../../../../types';
import {Theme} from '../../../utils/Constants';
import {navigate} from '../../../utils/nagivationUtils';
import {setTheme} from '../../../../store/slices/business';
import {showToast} from '../../../service/fn';
import {useTheme} from '../../../hooks/index';

const ThemePicker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();

  const handleThemeChange = (theme: AppThemeName) => {
    let themeData: AppTheme | undefined = Theme.find(s => s.name === theme);
    if (themeData) {
      dispatch(setTheme(themeData));
      navigate('SplashScreen');
    } else {
      showToast({type: 'error', text1: 'Unable to set theme.'});
      return;
    }
  };

  return (
    <Picker
      style={[
        styles.dropdown,
        {
          color: currentTheme.modal.pickerText,
          backgroundColor: currentTheme.modal.pickerbg,
        },
      ]}
      selectedValue={currentTheme?.name}
      onValueChange={(value: AppThemeName) => handleThemeChange(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      <Picker.Item
        label={`${AppThemeName.PURPLE} 🟣`}
        value={AppThemeName.PURPLE}
      />
      <Picker.Item
        label={`${AppThemeName.YELLOW} 🟡`}
        value={AppThemeName.YELLOW}
      />
      <Picker.Item label={`${AppThemeName.RED} 🔴`} value={AppThemeName.RED} />
      <Picker.Item
        label={`${AppThemeName.GREEN} 🟢`}
        value={AppThemeName.GREEN}
      />
      <Picker.Item
        label={`${AppThemeName.BLUE} 🔵`}
        value={AppThemeName.BLUE}
      />
      <Picker.Item
        label={`${AppThemeName.CORAL} 🟠`}
        value={AppThemeName.CORAL}
      />
    </Picker>
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
  },
});

export default ThemePicker;
