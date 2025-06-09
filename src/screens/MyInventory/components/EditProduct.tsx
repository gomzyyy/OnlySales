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
import {MeasurementType} from '../../../../enums';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {useTheme} from '../../../hooks/index';
import {useTranslation} from 'react-i18next';
import {global} from '../../../styles/global';

type EditProductProps = {
  product: Product;
  close: () => void;
};

const EditProduct: React.FC<EditProductProps> = ({
  product,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation('inventory');

  // Store as string for controlled input
  const [name, setName] = useState<string>(product.name);
  const [price, setPrice] = useState<string>(product.basePrice.toString());
  const [discountedPrice, setDiscountedPrice] = useState<string>(
    product.discountedPrice?.toString() ?? '0',
  );
  const [quantity, setQuantity] = useState<string>(product.quantity.toString());
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    product.measurementType,
  );
  const handleOnSubmit = async () => {
    if (!name.trim()) {
      showToast({type: 'error', text1: t('i_input_name_required')});
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      showToast({type: 'error', text1: t('i_input_quantity_required')});
      return;
    }
    if (Number(price) === 0) {
      const res = await Confirm(t('i_confirm_zero_price'));
      if (!res) return;
    }

    // const data = {
    //   name: name.length !== 0 ? name : product.name,
    //   basePrice: Number(price),
    //   discountedPrice: Number(discountedPrice),
    //   quantity: Number(quantity),
    //   measurementType,
    //   createdAt: product.createdAt,
    //   updatedAt: Date.now().toString(),
    //   totalSold: product.totalSold,
    // };

    close();
    showToast({
      type: 'success',
      text1: `${t('i_product_edited_successfully')}: ${product.name}`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.createCustomerContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
        {t('i_header_title')}: {product.name}
      </Text>
      <ScrollView
        style={{flex: 1,marginBottom:10}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              {t('i_input_name_label')}*
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_input_name_placeholder')}
              placeholderTextColor={currentTheme.baseColor}
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              {t('i_input_price_label')}*
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_input_price_placeholder')}
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
              {t('i_input_discount_label')}
            </Text>
            <TextInput
              value={discountedPrice}
              onChangeText={setDiscountedPrice}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_input_discount_placeholder')}
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
              {t('i_input_quantity_label')}*
            </Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_input_quantity_placeholder')}
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
              {t('i_input_measurement_label')}
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
              <Picker.Item label="Ml" value={MeasurementType.ML} />
              <Picker.Item label="Litre" value={MeasurementType.LITRE} />
              <Picker.Item label="Kilograms" value={MeasurementType.KILOGRAM} />
              <Picker.Item label="Grams" value={MeasurementType.GRAMS} />
              <Picker.Item label="Pcs" value={MeasurementType.PCS} />
              <Picker.Item label="Pack" value={MeasurementType.PACK} />
              <Picker.Item label="Dozen" value={MeasurementType.DOZEN} />
            </Picker>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.saveButton, {backgroundColor: currentTheme.baseColor}]}
        activeOpacity={0.8}
        onPress={handleOnSubmit}>
        <Text style={styles.saveButtonText}>{t('i_button_save')}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    height: deviceHeight * 0.55,
    borderRadius: 20,
    elevation: 30,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'italic',
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
    fontSize: 16,
    fontWeight: '600',
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

export default EditProduct;
