import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import { AdminRole } from '../../enums';
import {useTheme} from '../hooks/index';


type RolePickerProps = {
    enabled?:boolean;
 setState:Dispatch<SetStateAction<AdminRole>>;
 value:AdminRole;
};

const RolePicker:React.FC<RolePickerProps> = ({enabled=false,setState,value}):React.JSX.Element => {
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
    onValueChange={(value: AdminRole) => setState(value)}
    dropdownIconColor={currentTheme?.modal.pickerText}>
    <Picker.Item
      label={`${AdminRole.SHOPKEEPER} ${!enabled ? "(disabled)" : ""}`}
      value={AdminRole.SHOPKEEPER}
    />
    <Picker.Item label={`${AdminRole.CUSTOMER} ${enabled === false ? "(disabled)" : ""}`} value={AdminRole.CUSTOMER} />
  </Picker>)
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default RolePicker;
