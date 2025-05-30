import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker as P} from '@react-native-picker/picker';
import {useTheme} from '../hooks/index';

type PickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<any>>;
  value: any;
  data: {[key: string | number]: string | number};
};

const Picker: React.FC<PickerProps> = ({
  enabled = false,
  setState,
  value,
  data,
}): React.JSX.Element => {
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
      onValueChange={(value: any) => setState(value)}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      {Object.keys(data).map(key => (
        <P.Item
          key={key}
          label={`${data[key as keyof typeof data]} ${
            enabled === false ? '(disabled)' : ''
          }`}
          value={data[key as keyof typeof data]}
        />
      ))}
    </P>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default Picker;
