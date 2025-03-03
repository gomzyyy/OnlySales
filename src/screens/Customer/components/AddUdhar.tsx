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
import {deviceHeight} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import MenuItem from './MenuItem';
import SearchBar from '../../Search/components/subcomponents/SearchBar';
import {Customer, newUdharProduct, Product} from '../../../../types';
import {addNewUdhar} from '../../../../store/slices/shopkeeper';
import useTheme from '../../../hooks/useTheme';

type AddUdharProps = {
  close?: () => void;
  customer: Customer;
};

const AddUdhar: React.FC<AddUdharProps> = ({
  close,
  customer,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const menu = useSelector((s: RootState) => s.shopkeeper.shopkeeper.menu);
  const currencyType = useSelector((s: RootState) => s.shopkeeper.app.currency);
  const [query, setQuery] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<newUdharProduct[]>(
    [],
  );
  const [udharAmount, setUdharAmount] = useState<number>(0);
  const sortedMenu: Product[] = [...menu].sort(
    (a, b) => b.totalSold - a.totalSold,
  );

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
      setSelectedProducts(
        [...(selectedProducts || []), {...s}].map(
          s => s && {...s, createdAt: new Date(Date.now()).toDateString()},
        ),
      );
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
      setUdharAmount(
        udharAmount +
          Number(
            product.discountedPrice === 0
              ? product.basePrice
              : product.discountedPrice,
          ),
      );
    }
    if (action === 'MINUS') {
      setUdharAmount(
        udharAmount -
          Number(
            product.discountedPrice === 0
              ? product.basePrice
              : product.discountedPrice,
          ),
      );
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
      style={[
        styles.addUdharContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
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
          nestedScrollEnabled
          contentContainerStyle={{
            gap: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {sortedMenu.map((f, i) => (
            <MenuItem key={i} product={f} callback={handleSetUdharAmount} />
          ))}
        </ScrollView>
        {/* </View>     */}
        <TouchableOpacity
          style={[styles.doneAdding, {backgroundColor: currentTheme.baseColor}]}
          activeOpacity={0.8}
          onPress={handleAddUdharBtn}>
          <Text
            style={[
              styles.doneAddingText,
              {color: currentTheme.modal.saveBtnText},
            ]}>
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
    padding: 20,
    height: deviceHeight * 0.65,
    borderRadius: 20,
    marginBottom: 10,
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
    // borderColor: currentTheme.baseColor,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  selectedProductList: {
    flex: 1,
    marginTop: 4,
    // backgroundColor: currentTheme.bgColor,
    borderRadius: 8,
    padding: 8,
  },
  productsContainer: {
    flex: 1,
  },
  bestSellers: {},
  bestSellerText: {
    fontWeight: 'semibold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  bestSellerProducts: {
    // gap:10,
    // flexDirection:"row",
    // flexWrap:"wrap"
  },
  searchBarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  products: {
    flex: 1,
    marginBottom: 10,
  },
  doneAdding: {
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  doneAddingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
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
