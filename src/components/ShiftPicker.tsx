import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Shift} from '../../enums';
import {useTheme} from '../hooks/index';

type ShiftPickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<Shift>>;
  value: Shift;
};

const ShiftPicker: React.FC<ShiftPickerProps> = ({
  enabled = false,
  setState,
  value,
}): React.JSX.Element => {
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
      onValueChange={(value: Shift) => setState(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      <Picker.Item
        label={`${Shift.MORNING} ${!enabled ? '(disabled)' : ''}`}
        value={Shift.MORNING}
      />
      <Picker.Item
        label={`${Shift.evening} ${enabled === false ? '(disabled)' : ''}`}
        value={Shift.evening}
      />
      <Picker.Item
        label={`${Shift.NIGHT} ${enabled === false ? '(disabled)' : ''}`}
        value={Shift.NIGHT}
      />
      <Picker.Item
        label={`${Shift.UNDECIDED} ${enabled === false ? '(disabled)' : ''}`}
        value={Shift.UNDECIDED}
      />
    </Picker>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default ShiftPicker;
