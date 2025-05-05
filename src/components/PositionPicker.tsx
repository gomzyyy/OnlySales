import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Position} from '../../enums';
import {useTheme} from '../hooks/index';

type PositionPickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<Position>>;
  value: Position;
};

const PositionPicker: React.FC<PositionPickerProps> = ({
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
      onValueChange={(value: Position) => setState(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      {Object.keys(Position).map(key => (
        <Picker.Item
          key={key}
          label={`${Position[key as keyof typeof Position]} ${
            enabled === false ? '(disabled)' : ''
          }`}
          value={Position[key as keyof typeof Position]}
        />
      ))}
    </Picker>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default PositionPicker;
