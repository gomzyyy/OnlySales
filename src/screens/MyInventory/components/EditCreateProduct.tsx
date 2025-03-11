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
import {deviceHeight} from '../../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';
import {Product} from '../../../../types';
import {Picker} from '@react-native-picker/picker';
import {QuantityType} from '../../../../enums';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {useTheme} from '../../../hooks/index';
import { editInventoryProduct } from '../../../../store/slices/shopkeeper';

type EditProductProps = {
  product: Product;
  close: () => void;
};

const EditCreateProduct: React.FC<EditProductProps> = ({
  product,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>()
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
    dispatch(editInventoryProduct({product:updatedProduct}))
    close();
    showToast({
      type: 'success',
      text1: `Product Edited successfully: ${product.name}`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.createCustomerContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{flex: 1}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
          Edit Product: {product.name}
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              Product name*
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter name"
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              Product price*
            </Text>
            <TextInput
              value={price.toString()}
              onChangeText={s => setPrice(Number(s) || 0)}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter price"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              Product discounted price
            </Text>
            <TextInput
              value={discountedPrice.toString()}
              onChangeText={s => setDiscountedPrice(Number(s) || 0)}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter discounted price"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              Product quantity*
            </Text>
            <TextInput
              value={quantity.toString()}
              onChangeText={value => setQuantity(Number(value))}
              style={[styles.inputText, {borderColor: currentTheme.modal.inputBorder}]}
              placeholder="Enter quantity"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {
                  color: currentTheme.modal.inputText,
                },
              ]}>
              Product measurement type
            </Text>
            <Picker
              selectedValue={measurementType}
              onValueChange={value => setMeasurementType(value)}
              dropdownIconColor={currentTheme.textAlt}
              style={[
                styles.dropdown,
                {
                  color: currentTheme.modal.pickerText,
                  backgroundColor: currentTheme.modal.pickerbg,
                },
              ]}>
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
            style={[
              styles.saveButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
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
    height: deviceHeight * 0.75,
    borderRadius: 20,
    marginBottom: 10,
    elevation:30,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  dropdown: {},
  saveButton: {
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
