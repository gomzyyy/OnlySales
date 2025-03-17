import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import {EmploymentStatus} from '../../enums';
import {useTheme} from '../hooks/index';

type EmployementStatusPickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<EmploymentStatus>>;
  value: EmploymentStatus;
};

const EmployementStatusPicker: React.FC<EmployementStatusPickerProps> = ({
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
      onValueChange={(value: EmploymentStatus) => setState(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      <Picker.Item
        label={`${EmploymentStatus.ACTIVE} ${!enabled ? '(disabled)' : ''}`}
        value={EmploymentStatus.ACTIVE}
      />
      <Picker.Item
        label={`${EmploymentStatus.INACTIVE} ${
          enabled === false ? '(disabled)' : ''
        }`}
        value={EmploymentStatus.INACTIVE}
      />
      <Picker.Item
        label={`${EmploymentStatus.RESIGNATION} ${
          enabled === false ? '(disabled)' : ''
        }`}
        value={EmploymentStatus.RESIGNATION}
      />
      <Picker.Item
        label={`${EmploymentStatus.TERMINATED} ${
          enabled === false ? '(disabled)' : ''
        }`}
        value={EmploymentStatus.TERMINATED}
      />
    </Picker>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default EmployementStatusPicker;
