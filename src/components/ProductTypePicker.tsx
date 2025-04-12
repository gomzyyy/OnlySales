import {StyleSheet} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {Picker} from '@react-native-picker/picker';
import {ProductType} from '../../enums';
import {useHaptics, useTheme} from '../hooks/index';

type ProductTypePickerProps = {
  enabled?: boolean;
  setState: Dispatch<SetStateAction<ProductType>>;
  value: ProductType;
};

const ProductTypePicker: React.FC<ProductTypePickerProps> = ({
  enabled = false,
  setState,
  value,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {lightTap} = useHaptics();
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
      onValueChange={(value: ProductType) => {
        lightTap();
        setState(value);
      }}
      dropdownIconColor={currentTheme?.modal.pickerText}>
      <Picker.Item
        label={`${ProductType.PHYSICAL} ${!enabled ? '(disabled)' : ''}`}
        value={ProductType.PHYSICAL}
      />
      <Picker.Item
        label={`${ProductType.SUBSCRIPTION} ${!enabled ? '(disabled)' : ''}`}
        value={ProductType.SUBSCRIPTION}
      />
      <Picker.Item
        label={`${ProductType.DIGITAL} ${
          enabled === false ? '(disabled)' : ''
        }`}
        value={ProductType.DIGITAL}
      />
      <Picker.Item
        label={`${ProductType.SERVICE} ${
          enabled === false ? '(disabled)' : ''
        }`}
        value={ProductType.SERVICE}
      />
    </Picker>
  );
};

const styles = StyleSheet.create({
  dropdown: {},
});

export default ProductTypePicker;
