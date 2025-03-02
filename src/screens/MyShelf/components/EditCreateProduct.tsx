import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import {Confirm, showToast} from '../../../service/fn';

type EditProductProps = {
  product: Product;
  close: () => void;
};

const EditCreateProduct: React.FC<EditProductProps> = ({
  product,
  close,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>(product.name);
  const [price, setPrice] = useState<number>(product.basePrice);
  const [discountedPrice, setDiscountedPrice] = useState<number>(
    product.discountedPrice ?? 0,
  );
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const [measurementType, setMeasurementType] = useState<QuantityType>(
    product.measurementType,
  );

  const handleOnSubmit = () => {
    if (price === 0) {
      const res = Confirm('Are you sure to put the price 0?');
      if (!res) return;
    }
    const updatedProduct: Product = {
      id: product.id,
      name: name.length !== 0 ? name : product.name,
      basePrice: price,
      discountedPrice,
      quantity,
      measurementType,
      createdAt: product.createdAt,
      updatedAt: Date.now().toString(),
      totalSold: product.totalSold,
    };
    close();
    showToast({
      type: 'success',
      text1: `Product Edited successfully: ${product.name}`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.createCustomerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{flex: 1}} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Edit Product: {product.name}</Text>
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
              value={price.toString()}
              onChangeText={s => setPrice(Number(s) || 0)}
              style={styles.inputText}
              placeholder="Enter price"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputLabel}>Product discounted price</Text>
            <TextInput
              value={discountedPrice.toString()}
              onChangeText={s => setDiscountedPrice(Number(s) || 0)}
              style={styles.inputText}
              placeholder="Enter discounted price"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType='numeric'
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputLabel}>Product quantity*</Text>
            <TextInput
              value={quantity.toString()}
              onChangeText={value=>setQuantity(Number(value))}
              style={styles.inputText}
              placeholder="Enter quantity"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType='numeric'
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.75,
    borderRadius: 20,
    marginBottom: 10,
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

export default EditCreateProduct;
