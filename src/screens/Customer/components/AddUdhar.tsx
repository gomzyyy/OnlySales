import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {currentTheme, deviceHeight} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import MenuItem from './MenuItem';
import {sampleProducts} from '../../../../_data/dummy_data';
import SearchBar from '../../Search/components/subcomponents/SearchBar';
import {Customer, newUdharProduct, Product} from '../../../../types';
import {addNewUdhar} from '../../../../store/slices/shopkeeper';

type AddUdharProps = {
  close?: () => void;
  customer: Customer;
};

const AddUdhar: React.FC<AddUdharProps> = ({
  close,
  customer,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const shelf = useSelector((s: RootState) => s.shopkeeper.shopkeeper.menu);
  const currencyType = useSelector((s: RootState) => s.shopkeeper.app.currency);
  const [query, setQuery] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<
    newUdharProduct[] | undefined
  >(undefined);
  const [udharAmount, setUdharAmount] = useState<number>(0);

  const handleNewUdhars = (s: newUdharProduct) => {
    const alreadyExist: newUdharProduct | undefined = selectedProducts
      ? selectedProducts.find(f => f.id === s.id)
      : undefined;
    if (alreadyExist) {
      if (alreadyExist.count === 0) {
        return;
      }
      setSelectedProducts(prev =>
        prev
          ? prev.map(v =>
              v.id === alreadyExist.id ? {...alreadyExist, count: s.count} : v,
            )
          : [{...s}],
      );
    } else {
      setSelectedProducts([...(selectedProducts || []), {...s}]);
    }
  };

  const handleSetUdharAmount = ({
    product,
    action,
    count,
  }: {
    product: Product;
    action: 'ADD' | 'MINUS';
    count: number;
  }) => {
    if (action === 'ADD') {
      setUdharAmount(udharAmount + Number(product.discountedPrice ?? product.basePrice));
    }
    if (action === 'MINUS') {
      setUdharAmount(udharAmount - Number(product.discountedPrice ?? product.basePrice))
    }
    const newProducts: newUdharProduct = {
      ...product,
      count: count,
      addedAt: Date.now().toString(),
    };
    handleNewUdhars(newProducts);
  };

  const handleAddUdharBtn = () => {
    if (selectedProducts && selectedProducts.length !== 0) {
      dispatch(
        addNewUdhar({
          customer,
          products: selectedProducts,
        }),
      );
    }
    close && close();
  };

  return (
    <KeyboardAvoidingView
      style={styles.addUdharContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Add new Product</Text>
      <View style={styles.searchBarContainer}>
        <SearchBar
          query={query}
          setQuery={setQuery}
          width={0.9}
          autoFocus={false}
        />
      </View>
      <View style={styles.productsContainer}>
        <ScrollView
          style={styles.products}
          contentContainerStyle={{
            gap: 8,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {sampleProducts.map((m, i) => (
            <MenuItem product={m} key={i} callback={handleSetUdharAmount} />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.doneAdding}
          activeOpacity={0.8}
          onPress={handleAddUdharBtn}>
          <Text style={styles.doneAddingText}>
            {udharAmount === 0
              ? 'Cancel'
              : `Add Udhar of ${currencyType} ${udharAmount}`}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  addUdharContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.75,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  selectedProductsContainer: {
    marginBottom: 10,
    height: 120,
    borderWidth: 2,
    borderColor: currentTheme.baseColor,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  selectedProductList: {
    flex: 1,
    marginTop: 4,
    backgroundColor: currentTheme.bgColor,
    borderRadius: 8,
    padding: 8,
  },
  productsContainer: {
    flex: 1,
  },
  searchBarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  products: {
    marginBottom: 10,
  },
  doneAdding: {
    backgroundColor: currentTheme.baseColor,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  doneAddingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: currentTheme.modal.saveBtnText,
  },
});

export default AddUdhar;

// <View
// style={[
//   styles.selectedProductsContainer,
//   {width: deviceWidth * 0.9},
// ]}>
// <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
//   {selectedProducts.length === 0
//     ? 'No Products selected'
//     : 'Selected products'}
// </Text>
// <ScrollView
//   style={styles.selectedProductList}
//   contentContainerStyle={{
//     gap: 8,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   }}>
//   {selectedProducts.map((m, i) => (
//     <MenuItem
//       product={m}
//       key={i}
//       removeIcon={true}
//       onPress={handleRemoveSelectedProducts}
//     />
//   ))}
// </ScrollView>
// </View>
