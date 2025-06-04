import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import InventoryItem from './InventoryItem';
import SearchBar from '../../SearchCustomer/components/subcomponents/SearchBar';
import {Customer, SoldProduct, Product, Owner} from '../../../../types';
import {useAnalytics, useTheme} from '../../../hooks/index';
import EmptyListMessage from '../../../components/EmptyListMessage';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import {sellProductAPI} from '../../../api/api.soldproduct';
import {setUser} from '../../../../store/slices/business';
import {showToast} from '../../../service/fn';
import {useTranslation} from 'react-i18next';
import {validateTokenAPI} from '../../../api/api.auth';

type AddUdharProps = {
  close?: () => void;
  customer: Customer;
};

const AddUdhar: React.FC<AddUdharProps> = ({
  close,
  customer,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {t} = useTranslation('customer');
  const {owner} = useAnalytics();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const inventory = owner.inventory;
  const sortedInventory: Product[] = [...inventory].sort(
    (a, b) => b.totalSold - a.totalSold,
  );
  const currencyType = useSelector((s: RootState) => s.appData.app.currency);
  const [inventoryItems, setInventoryItems] =
    useState<Product[]>(sortedInventory);
  const [query, setQuery] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<
    {product: Product | undefined; count: number}[]
  >([]);
  const [udharAmount, setUdharAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const handleNewUdhars = ({
    product,
    count,
  }: {
    product: Product;
    count: number;
  }) => {
    const alreadyExist:
      | {product: Product | undefined; count: number}
      | undefined = selectedProducts.find(f => f.product?._id === product._id);
    if (alreadyExist) {
      if (alreadyExist.count === 0) {
        return;
      }
      setSelectedProducts(p =>
        p?.map(v => (v.product?._id ? {...v, count} : v)),
      );
    } else {
      setSelectedProducts(
        [...(selectedProducts || []), {product, count}].map(
          s =>
            s && {
              ...s,
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
            product.discountedPrice && product.discountedPrice !== 0
              ? product.discountedPrice
              : product.basePrice,
          ),
      );
    }
    if (action === 'MINUS') {
      setUdharAmount(
        udharAmount -
          Number(
            product.discountedPrice && product.discountedPrice !== 0
              ? product.discountedPrice
              : product.basePrice,
          ),
      );
    }
  };
  const handleAddUdharBtn = async () => {
    let atLeastOneSuccess = false;
    setLoading(true);
    try {
      for (const p of selectedProducts) {
        if (p.product && p.count > 0) {
          const data = {
            query: {
              buyerId: customer._id,
              sellerId: user._id,
              role: user.role,
            },
            body: {productId: p.product._id, count: p.count},
          };
          const res = await sellProductAPI(data);
          if (res.success) {
            atLeastOneSuccess = true;
          } else {
            showToast({
              type: 'error',
              text1: t('c_addproduct_error_response', {
                errorMessage: res.message,
              }),
            });
          }
        } else {
          showToast({
            type: 'error',
            text1: t('c_addproduct_error_item', {productName: p.product?.name}),
          });
        }
      }
      if (atLeastOneSuccess) {
        const userRes = await validateTokenAPI({role: user.role});
        if (userRes.success && userRes.data?.user) {
          dispatch(setUser(userRes.data.user));
        }
        close?.();
        showToast({
          type: 'success',
          text1: t('c_addproduct_success'),
        });
      } else {
        showToast({
          type: 'info',
          text1: t('c_addproduct_error_generic'),
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        text1: t('c_addproduct_error_generic'),
      });
    } finally {
      setLoading(false);
    }
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
          placeholderText={t('c_addproduct_title')}
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
            }}
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              backgroundColor: currentTheme.bgColor,
              padding: 8,
              borderRadius: 8,
            }}>
            {inventoryItems.map(
              (f, i) =>
                !f.disabled && (
                  <InventoryItem
                    key={i}
                    product={f}
                    callback={handleSetUdharAmount}
                    onSelectProduct={handleNewUdhars}
                  />
                ),
            )}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>
            <EmptyListMessage title={t('c_noproducts')} />
          </View>
        )}
        <View style={{flexDirection: 'row', gap: 6, marginTop: 10}}>
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
                ? t('c_addproduct_cancel')
                : loading
                ? t('c_addproduct_adding')
                : t('c_addproduct_addudhar', {
                    currency: currencyType,
                    amount: udharAmount,
                  })}
            </Text>
            {loading && (
              <ActivityIndicator size={18} color={currentTheme.contrastColor} />
            )}
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
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: deviceHeight * 0.6,
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
    // marginBottom: 10,
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneAddingText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  addProductBtn: {
    paddingVertical: 16,
    borderRadius: 8,
    // marginBottom: 10,
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProductText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddUdhar;
