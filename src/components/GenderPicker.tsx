import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Gender} from '../../enums';
import {useTheme} from '../hooks/index';

type GenderPickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<Gender>>;
  value: Gender;
};

const GenderPicker: React.FC<GenderPickerProps> = ({
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
      onValueChange={(value: Gender) => setState(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      <Picker.Item
        label={`${Gender.MALE} ${!enabled ? '(disabled)' : ''}`}
        value={Gender.MALE}
      />
      <Picker.Item
        label={`${Gender.FEMALE} ${enabled === false ? '(disabled)' : ''}`}
        value={Gender.FEMALE}
      />

      <Picker.Item
        label={`${Gender.OTHER} ${enabled === false ? '(disabled)' : ''}`}
        value={Gender.OTHER}
      />
      <Picker.Item
        label={`${Gender.RATHER_NOT_TO_SAY} ${
          enabled === false ? '(disabled)' : ''
        }`}
        value={Gender.RATHER_NOT_TO_SAY}
      />
    </Picker>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default GenderPicker;
