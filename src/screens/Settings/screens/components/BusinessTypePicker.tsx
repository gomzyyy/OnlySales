import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../../store/store';
import {Picker} from '@react-native-picker/picker';
import {BusinessType} from '../../../../../enums';
import {AppTheme} from '../../../../../types';
import {navigate} from '../../../../utils/nagivationUtils';
import {setTheme} from '../../../../../store/slices/shopkeeper';
import {showToast} from '../../../../service/fn';
import useTheme from '../../../../hooks/useTheme';


type BusinessTypePickerProps = {
    enabled?:boolean;
 setState:Dispatch<SetStateAction<BusinessType>>;
 value:BusinessType;
};

const BusinessTypePicker:React.FC<BusinessTypePickerProps> = ({enabled=false,setState,value}):React.JSX.Element => {
  const {currentTheme} = useTheme();

  return ( <Picker
    style={[
      styles.dropdown,
      {
        color: currentTheme.modal.pickerText,
        backgroundColor: currentTheme.modal.pickerbg,
      },
    ]}
    enabled={enabled}
    selectedValue={value}
    onValueChange={(value: BusinessType) => setState(value)}
    dropdownIconColor={currentTheme?.modal.pickerText}>
    <Picker.Item
      label={`${BusinessType.DISTRIBUTION} ${!enabled ? "(disabled)" : ""}`}
      value={BusinessType.DISTRIBUTION}
    />
    <Picker.Item label={`${BusinessType.MANUFACTURING} ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.MANUFACTURING} />
    <Picker.Item
      label={`${BusinessType.RETAIL} ${!enabled ? "(disabled)" : ""}`}
      value={BusinessType.RETAIL}
    />
    <Picker.Item label={`${BusinessType.SERVICE} ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.SERVICE} />
    <Picker.Item label={`${BusinessType.WHOLESALE} ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.WHOLESALE} />
  </Picker>)
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default BusinessTypePicker;
