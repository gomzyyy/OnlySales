import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Department} from '../../enums'; // Import the Department enum
import {useTheme} from '../hooks/index';

type DepartmentPickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<Department>>;
  value: Department;
};

const DepartmentPicker: React.FC<DepartmentPickerProps> = ({
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
      onValueChange={(value: Department) => setState(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      {Object.keys(Department).map(key => (
        <Picker.Item
          key={key}
          label={`${Department[key as keyof typeof Department]} ${
            enabled === false ? '(disabled)' : ''
          }`}
          value={Department[key as keyof typeof Department]}
        />
      ))}
    </Picker>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    // Customize your dropdown style if needed
  },
});

export default DepartmentPicker;
