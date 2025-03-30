import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import InventoryItem from './InventoryItem';
import SearchBar from '../../SearchCustomer/components/subcomponents/SearchBar';
import {Customer, SoldProduct, Product} from '../../../../types';
import {addNewUdhar} from '../../../../store/slices/business';
import {useTheme} from '../../../hooks/index';
import EmptyListMessage from '../../../components/EmptyListMessage';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';

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
  const inventory = useSelector(
    (s: RootState) => s.appData.BusinessOwner.inventory,
  );
  const sortedInventory: Product[] = [...inventory].sort(
    (a, b) => b.totalSold - a.totalSold,
  );
  const currencyType = useSelector((s: RootState) => s.appData.app.currency);
  const [inventoryItems, setInventoryItems] =
    useState<Product[]>(sortedInventory);
  const [query, setQuery] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<SoldProduct[]>([]);
  const [udharAmount, setUdharAmount] = useState<number>(0);

  const handleNewUdhars = (s: SoldProduct) => {
    const alreadyExist: SoldProduct | undefined = selectedProducts
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
          s =>
            s && {
              ...s,
              createdAt: new Date(Date.now()
              //  - (3*24*60*60*1000)
              ).toDateString(),
            },
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
    const newProducts: SoldProduct = {
      ...product,
      buyer:customer.id,
      count: count,
      addedAt: Date.now()
      //  - (3*24*60*60*1000),
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

  useEffect(() => {
    if (query.trim().length !== 0) {
      const queryResults = inventoryItems.filter(s =>
        s.name.trim().toLowerCase().includes(query.trim().toLowerCase()),
      );
      queryResults.length !== 0 && setInventoryItems(queryResults);
    } else {
      setInventoryItems(sortedInventory);
    }
    return () => {
      setInventoryItems(sortedInventory);
    };
  }, [query]);

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
          shadow={3}
          placeholderText="Search Products"
        />
      </View>
      <View style={styles.productsContainer}>
        {inventoryItems.length !== 0 ? (
          <ScrollView
            nestedScrollEnabled
            contentContainerStyle={{
              gap: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {inventoryItems.map((f, i) => (
              <InventoryItem
                key={i}
                product={f}
                callback={handleSetUdharAmount}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>
            <EmptyListMessage title="No Products to show." />
          </View>
        )}
        <View style={{flexDirection: 'row', gap: 6}}>
          <TouchableOpacity
            style={[
              styles.doneAdding,
              {backgroundColor: currentTheme.baseColor},
            ]}
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
          <TouchableOpacity
            style={[
              styles.addProductBtn,
              {backgroundColor: currentTheme.baseColor},
            ]}
            onPress={() => {
              navigate('MyInventory');
            }}>
            <Text
              style={[
                styles.addProductText,
                {color: currentTheme.modal.saveBtnText},
              ]}>
              Add
            </Text>
            <Icon
              name="plus"
              size={18}
              color={currentTheme.modal.saveBtnText}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  addUdharContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: deviceHeight * 0.55,
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
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  selectedProductList: {
    flex: 1,
    marginTop: 4,
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
  bestSellerProducts: {},
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
    flex: 2,
  },
  doneAddingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  addProductBtn: {
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  addProductText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddUdhar;
