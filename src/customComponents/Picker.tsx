import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker as P} from '@react-native-picker/picker';
import {useTheme} from '../hooks/index';

type PickerProps<T> = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<T>>;
  value: T;
  data: Record<string, T>;
};

const Picker = <T extends string | number>({
  enabled = false,
  setState,
  value,
  data,
}: PickerProps<T>): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <P
      style={[
        styles.dropdown,
        {
          color: currentTheme.modal.pickerText,
          backgroundColor: currentTheme.modal.pickerbg,
        },
      ]}
      enabled={enabled}
      selectedValue={value}
      onValueChange={(v: T) => setState(v)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      {Object.entries(data).map(([key, val]) => (
        <P.Item
          key={key}
          label={`${val} ${enabled === false ? '(disabled)' : ''}`}
          value={val}
        />
      ))}
    </P>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default Picker;
