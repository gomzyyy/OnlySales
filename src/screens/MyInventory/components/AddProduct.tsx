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
import {useAnalytics, useTheme} from '../../../hooks/index';
import {isFloat, isNumber} from '../../../service/test';
import {createProductAPI} from '../../../api/api.product';
import ProductTypePicker from '../../../components/ProductTypePicker';
import SlideUpContainer from '../../../components/SlideUpContainer';
import FilePicker from '../../../components/FilePicker';
import {getUserAPI} from '../../../api/api.user';
import {setUser} from '../../../../store/slices/business';

type EditProductProps = {
  close: () => void;
};

const AddProduct: React.FC<EditProductProps> = ({close}): React.JSX.Element => {
  const {currentTheme} = useTheme();
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
    if (Number(stock) === 0) {
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
    const res = await createProductAPI(newProductData, setLoading);
    if (res.success && res.data.product) {
      const userRes = await getUserAPI(
        {
          role: user.role,
        },
        setLoading,
      );
      if (userRes.success && userRes.data.user) {
        dispatch(setUser(userRes.data.user));
        showToast({
          type: 'success',
          text1: res.message,
          text2: 'Pleas add products to create Udhars.',
        });
        close();
        return;
      }
      showToast({
        type: 'success',
        text1: `Product ${res.data.product.name} Created successfully`,
      });
      return;
    } else {
      close();
      showToast({
        type: 'error',
        text1: res.message,
      });
    }
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
        Add new Product
      </Text>
      <ScrollView style={{flex: 1}} nestedScrollEnabled>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text style={styles.inputLabel}>Product name*</Text>
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
            <Text style={styles.inputLabel}>Product Type*</Text>
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
              Product price*
            </Text>
            <TextInput
              value={price}
              onChangeText={value => setPrice(value)}
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
              value={discountedPrice}
              onChangeText={value => setDiscountedPrice(value)}
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
              value={quantity}
              onChangeText={value => setQuantity(value)}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter quantity"
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
              Product Stock*
            </Text>
            <TextInput
              value={stock}
              onChangeText={value => setStock(value)}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter Stock"
              placeholderTextColor={currentTheme.baseColor}
              keyboardType="numeric"
            />
          </View>
          {productType === ProductType.PHYSICAL && (
            <View style={[styles.inputTitleContainer, {gap: 5}]}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.inputText},
                ]}>
                Estimated Making cost:{' '}
                {`${productCost.trim().length !== 0 ? productCost : '0'}`}
              </Text>
              <TextInput
                value={productCost}
                onChangeText={value => setProductCost(value)}
                style={[
                  styles.inputText,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder="Enter Estimated Making cost"
                placeholderTextColor={currentTheme.baseColor}
                keyboardType="numeric"
              />
            </View>
          )}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.inputText},
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
              <Picker.Item label="Ml" value={MeasurementType.ML} />
              <Picker.Item label="Litre" value={MeasurementType.LITRE} />
              <Picker.Item label="Kilograms" value={MeasurementType.KILOGRAM} />
              <Picker.Item label="Grams" value={MeasurementType.GRAMS} />
              <Picker.Item label="Pcs" value={MeasurementType.PCS} />
              <Picker.Item label="Pack" value={MeasurementType.PACK} />
              <Picker.Item label="Dozen" value={MeasurementType.DOZEN} />
            </Picker>
          </View>
          {image && image.trim().length !== 0 ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{flex: 1}}>{`${image.slice(0, 40)}...`}</Text>
              <Button title="Remove" onPress={() => setImage(undefined)} />
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 40,
                alignItems: 'center',
              }}>
              <Button
                title="Choose Image"
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
              {loading ? 'Saving' : 'Save'}
            </Text>
            {loading && (
              <ActivityIndicator size={18} color={currentTheme.contrastColor} />
            )}
          </TouchableOpacity>
        </View>
        <SlideUpContainer
          opacity={0.2}
          open={openImagePicker}
          close={closeImagePicker}>
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
