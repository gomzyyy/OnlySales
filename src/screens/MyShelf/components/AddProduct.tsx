import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight, currentTheme} from '../../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';
import {Product} from '../../../../types';
import {Picker} from '@react-native-picker/picker';
import {QuantityType} from '../../../../enums';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {editShelfProduct} from '../../../../store/slices/shopkeeper';
import { showToast } from '../../../service/fn';

type EditProductProps = {
  close: () => void;
};

const AddProduct: React.FC<EditProductProps> = ({close}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [discountedPrice, setDiscountedPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [measurementType, setMeasurementType] = useState<QuantityType>(QuantityType.GRAMS);

  const handleOnSubmit = () => {
    close();
    showToast({
      type: 'success',
      text1: `Product Created successfully`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.createCustomerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.formTitle}>Add new Product</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Product name*</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.inputText}
            placeholder="Enter name"
            placeholderTextColor={currentTheme.baseColor}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Product price*</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            style={styles.inputText}
            placeholder="Enter price"
            placeholderTextColor={currentTheme.baseColor}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Product discounted price</Text>
          <TextInput
            value={discountedPrice}
            onChangeText={setDiscountedPrice}
            style={styles.inputText}
            placeholder="Enter discounted price"
            placeholderTextColor={currentTheme.baseColor}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Product quantity*</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            style={styles.inputText}
            placeholder="Enter quantity"
            placeholderTextColor={currentTheme.baseColor}
          />
        </View>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputLabel}>Product measurement type</Text>
          <Picker
            selectedValue={measurementType}
            onValueChange={value => setMeasurementType(value)}
            dropdownIconColor={currentTheme.textAlt}
            style={styles.dropdown}>
            <Picker.Item label="Ml" value={'ml'} />
            <Picker.Item label="Litre" value={'litre'} />
            <Picker.Item label="Kilograms" value={'kilograms'} />
            <Picker.Item label="Grams" value={'grams'} />
            <Picker.Item label="Pcs" value={'pcs'} />
            <Picker.Item label="Pack" value={'pack'} />
            <Picker.Item label="Dozen" value={'dozen'} />
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleOnSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.75,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: currentTheme.modal.title,
  },
  formContainer: {
    marginTop: 20,
    gap: 16,
  },
  inputTitleContainer: {
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '400',
    color: currentTheme.modal.inputText,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: currentTheme.modal.inputBorder,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  dropdown: {
    color: currentTheme.modal.pickerText,
    backgroundColor: currentTheme.modal.pickerbg,
  },
  saveButton: {
    backgroundColor: currentTheme.baseColor,
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
});

export default AddProduct;
