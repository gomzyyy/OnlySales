import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import { CurrencyType } from '../../enums';
import {useTheme} from '../hooks/index';
import { Picker } from '@react-native-picker/picker';



type CurrencyPickerProps = {
    enabled?:boolean;
 setState:Dispatch<SetStateAction<CurrencyType>>;
 value:CurrencyType;
};

const CurrencyPicker:React.FC<CurrencyPickerProps> = ({enabled=false,setState,value}):React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
     <Picker
    style={[
      styles.dropdown,
      {
        color: currentTheme.modal.pickerText,
        backgroundColor: currentTheme.modal.pickerbg,
      },
    ]}
    enabled={enabled}
    selectedValue={value}
    onValueChange={(value: CurrencyType) => setState(value)}
    dropdownIconColor={currentTheme.modal.pickerText}>
    <Picker.Item
      label={`${CurrencyType.INR}`}
      value={CurrencyType.INR}
    />
  </Picker>)
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default CurrencyPicker;
