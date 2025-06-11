import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {MeasurementType, ProductType} from '../../../../enums';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {useAnalytics, useStorage, useTheme} from '../../../hooks/index';
import {isFloat, isNumber} from '../../../service/test';
import {createProductAPI} from '../../../api/api.product';
import ProductTypePicker from '../../../components/ProductTypePicker';
import SlideUpContainer from '../../../components/SlideUpContainer';
import FilePicker from '../../../components/FilePicker';
import {global} from '../../../styles/global';
import {useTranslation} from 'react-i18next';

type EditProductProps = {
  close: () => void;
};
const quantifiableProductTypes = [ProductType.PHYSICAL];

const AddProduct: React.FC<EditProductProps> = ({close}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {product} = useStorage();
  const {t} = useTranslation('inventory');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {owner} = useAnalytics();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('0');
  const [discountedPrice, setDiscountedPrice] = useState<string>('0');
  const [quantity, setQuantity] = useState<string>('1');
  const [stock, setStock] = useState<string>('0');
  const [image, setImage] = useState<string | undefined>();
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);
  const [productCost, setProductCost] = useState<string>('0');
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    MeasurementType.GRAMS,
  );
  const [productType, setProductType] = useState<ProductType>(
    ProductType.PHYSICAL,
  );

  const handleOnSubmit = async () => {
    const userRes = {
      res1: isNumber(price),
      res2: isNumber(discountedPrice),
      res3: isNumber(quantity),
    };
    const float = {
      res1: isFloat(stock),
      res2: isFloat(productCost),
    };
    if (!float.res1 || !float.res2) {
      Alert.alert(
        'Invalid input!',
        "Numeric entities can't include alphabets and only include '.'",
      );
      return;
    }
    if (!userRes.res1 || !userRes.res2 || !userRes.res3) {
      Alert.alert(
        'Invalid input!',
        "Numeric entities can't include alphabets and symbols",
      );
      return;
    }
    if (Number(quantity) === 0 || name.trim().length === 0) {
      Alert.alert('Some required fields are missing!');
      return;
    }
    if (Number(price) === 0) {
      const res = await Confirm(
        'Are you sure?',
        'You are trying to put the item price 0, please double check before creating.',
      );
      return;
    }
    if (quantifiableProductTypes.includes(productType) && Number(stock) === 0) {
      const res = await Confirm(
        "Stock value can't be zero!",
        'stock is required to keep a record and analytical calculations.',
      );
      return;
    }
    const newProductData = {
      query: {
        creatorId: user._id,
        ownerId: owner._id,
        role: user.role,
      },
      body: {
        name,
        basePrice: Number(price),
        quantity: Number(quantity),
        measurementType,
        stock: Number(stock),
        productCost: Number(productCost),
        productType,
        discountedPrice:
          Number(discountedPrice) === 0 ? undefined : Number(discountedPrice),
      },
      media: {
        image,
      },
    };
    const res = await product.create(newProductData, setLoading);
    if (res.success && res.data.product) {
      showToast({
        type: 'success',
        text1: `Product ${res.data.product.name} Created successfully`,
      });
    } else {
      showToast({
        type: 'error',
        text1: res.message,
      });
    }
    close();
  };
  const closeImagePicker = () => setOpenImagePicker(false);
  return (
    <KeyboardAvoidingView
      style={[
        styles.createCustomerContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
        {t('i_addinventoryitem_heading')}
      </Text>
      <ScrollView
        style={{flex: 1}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputLabel}>
              {t('i_addinventoryitem_label_itemname')}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_addinventoryitem_placeholder_itemname')}
              placeholderTextColor={'#ababab'}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputLabel}>
              {t('i_addinventoryitem_label_itemtype')}
            </Text>
            <ProductTypePicker
              value={productType}
              setState={setProductType}
              enabled
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              {t('i_addinventoryitem_label_itemprice')}
            </Text>
            <TextInput
              value={price}
              onChangeText={value => setPrice(value)}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_addinventoryitem_placeholder_price')}
              placeholderTextColor={'#ababab'}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              {t('i_addinventoryitem_label_itemdiscountedprice')}
            </Text>
            <TextInput
              value={discountedPrice}
              onChangeText={value => setDiscountedPrice(value)}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_addinventoryitem_placeholder_discountedprice')}
              placeholderTextColor={'#ababab'}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              {t('i_addinventoryitem_label_itemquantity')}
            </Text>
            <TextInput
              value={quantity}
              onChangeText={value => setQuantity(value)}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_addinventoryitem_placeholder_quantity')}
              placeholderTextColor={'#ababab'}
              keyboardType="numeric"
            />
          </View>
          {quantifiableProductTypes.includes(productType) && (
            <View style={styles.inputTitleContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.inputText},
                ]}>
                {t('i_addinventoryitem_label_itemstock')}
              </Text>
              <TextInput
                value={stock}
                onChangeText={value => setStock(value)}
                style={[
                  global.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder={t('i_addinventoryitem_placeholder_stock')}
                placeholderTextColor={'#ababab'}
                keyboardType="numeric"
              />
            </View>
          )}
          <View style={[styles.inputTitleContainer, {gap: 5}]}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
              ]}>
              {t('i_addinventoryitem_label_itemmakingcost')}
            </Text>
            <TextInput
              value={productCost}
              onChangeText={value => setProductCost(value)}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={t('i_addinventoryitem_placeholder_makingcost')}
              placeholderTextColor={'#ababab'}
              keyboardType="numeric"
            />
          </View>
          {quantifiableProductTypes.includes(productType) && (
            <View style={styles.inputTitleContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.inputText},
                ]}>
                {t('i_addinventoryitem_label_itemmeasurementtype')}
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
                <Picker.Item
                  label="Kilograms"
                  value={MeasurementType.KILOGRAM}
                />
                <Picker.Item label="Grams" value={MeasurementType.GRAMS} />
                <Picker.Item label="Pcs" value={MeasurementType.PCS} />
                <Picker.Item label="Pack" value={MeasurementType.PACK} />
                <Picker.Item label="Dozen" value={MeasurementType.DOZEN} />
              </Picker>
            </View>
          )}
          {image && image.trim().length !== 0 ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{flex: 1}}>{`${image.slice(0, 40)}...`}</Text>
              <Button
                title={t('i_addinventoryitem_label_itemremoveimagetext')}
                onPress={() => setImage(undefined)}
              />
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 40,
                alignItems: 'center',
              }}>
              <Button
                title={t('i_addinventoryitem_label_itemchooseimagetext')}
                onPress={() => setOpenImagePicker(true)}
              />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.saveButton,
              {backgroundColor: currentTheme.baseColor},
            ]}
            activeOpacity={0.8}
            onPress={handleOnSubmit}>
            <Text style={styles.saveButtonText}>
              {loading
                ? t('i_addinventoryitem_label_itemsaving')
                : t('i_addinventoryitem_label_itemsave')}
            </Text>
            {loading && (
              <ActivityIndicator size={18} color={currentTheme.contrastColor} />
            )}
          </TouchableOpacity>
        </View>
        <SlideUpContainer
          opacity={0.2}
          open={openImagePicker}
          close={closeImagePicker}
          height={220}>
          <FilePicker
            value={image}
            setState={setImage}
            callback={closeImagePicker}
            type="image"
          />
        </SlideUpContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: deviceHeight * 0.6,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
});

export default AddProduct;
