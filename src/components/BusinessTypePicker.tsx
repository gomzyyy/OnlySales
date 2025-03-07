import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import { BusinessType } from '../../enums';
import useTheme from '../hooks/useTheme';
import { Picker } from '@react-native-picker/picker';



type BusinessTypePickerProps = {
    enabled?:boolean;
 setState:Dispatch<SetStateAction<BusinessType>>;
 value:BusinessType;
};

const BusinessTypePicker:React.FC<BusinessTypePickerProps> = ({enabled=false,setState,value}):React.JSX.Element => {
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
    onValueChange={(value: BusinessType) => setState(value)}
    dropdownIconColor={currentTheme?.modal.pickerText}>
    <Picker.Item
      label={`Distribution ${!enabled ? "(disabled)" : ""}`}
      value={BusinessType.DISTRIBUTION}
    />
    <Picker.Item label={`Manufacturing ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.MANUFACTURING} />
    <Picker.Item
      label={`Retail ${!enabled ? "(disabled)" : ""}`}
      value={BusinessType.RETAIL}
    />
    <Picker.Item label={`Service ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.SERVICE} />
    <Picker.Item label={`Wholesale ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.WHOLESALE} />
    <Picker.Item label={`Other ${enabled === false ? "(disabled)" : ""}`} value={BusinessType.OTHER} />
  </Picker>)
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default BusinessTypePicker;
