import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Order, Product} from '../../../../types';
import {useTheme} from '../../../hooks';
import {colors, deviceHeight} from '../../../utils/Constants';
import {OrderStatus} from '../../../../enums';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {updateOrderStatusAPI} from '../../../api/api.orders';
import {sellProductAPI} from '../../../api/api.soldproduct';
import {showToast} from '../../../service/fn';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';
const NoPhoto = require('../../../assets/images/no-profile.jpg');

type Props = {
  order: Order;
};

const OrderDetailsContainer: React.FC<Props> = ({order}) => {
  const user = useSelector((s: RootState) => s.appData.user)!;
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const [loading, setLoading] = useState(false);

  const renderProduct = ({
    item,
    index,
  }: {
    item: {product: Product; count: number};
    index: number;
  }) => (
    <View style={styles.productRow}>
      <Text style={styles.label}>{item.product.name}</Text>
      <Text style={styles.value}>Qty: {item.count}</Text>
    </View>
  );
  const CreateSoldProductCase = [OrderStatus.ACCEPTED];
  const changeStatus = async (updatedStatus: OrderStatus) => {
    let atLeastOneSuccess = false;
    let spIds: string[] = [];
    const data = {
      query: {
        role: user.role,
        updatedStatus,
      },
      body: {
        order: order._id,
      },
    };
    const res = await updateOrderStatusAPI(data, setLoading);
    if (res.success && CreateSoldProductCase.includes(updatedStatus)) {
      try {
        for (const p of order.products) {
          if (p.product && p.count > 0) {
            const data = {
              query: {
                buyerId: order.orderedBy._id,
                sellerId: user._id,
                role: user.role,
                orderStatus: OrderStatus.COMPLETED,
              },
              body: {productId: p.product._id, count: p.count},
            };
            const res = await sellProductAPI(data);
            if (res.success) {
              atLeastOneSuccess = true;
              const soldId = res.data?.soldProduct?._id;
              if (soldId) {
                spIds.push(soldId);
              }
            } else {
              showToast({
                type: 'error',
                text1: res.message,
              });
            }
          } else {
            showToast({
              type: 'error',
              text1: res.message,
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
            text1: 'Order created successfully.',
          });
        } else {
          showToast({
            type: 'info',
            text1: 'Unknown error occured while accepting order.',
          });
        }
      } catch (err) {
        showToast({
          type: 'error',
          text1: 'Unknown error occured while accepting order.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: currentTheme.bgColor}]}>
      <ScrollView style={{flex: 1, borderRadius: 16}} nestedScrollEnabled>
        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Info</Text>
          <View style={styles.customerRow}>
            <Image
              source={
                order.orderedBy?.image ? {uri: order.orderedBy.image} : NoPhoto
              }
              style={styles.avatar}
            />
            <View>
              <Text style={styles.label}>{order.orderedBy.name}</Text>
              <Text style={styles.subText}>
                {order.orderedBy.phoneNumber || 'No phone'}
              </Text>
              <Text style={styles.subText}>
                {order.orderedBy.email?.value || 'No email'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Info</Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Order ID: </Text>
            {order._id}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Total Amount: </Text>₹
            {order.totalAmount.toFixed(2)}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Status: </Text>
            {order.orderStatus || 'N/A'}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Payment Method: </Text>
            {order.paymentMethod || 'N/A'}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Ordered At: </Text>
            {new Date(order.orderedAt || '').toLocaleString()}
          </Text>
          {order.acceptedAt && (
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Accepted At: </Text>
              {new Date(order.acceptedAt).toLocaleString()}
            </Text>
          )}
          {order.deliveredAt && (
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Delivered At: </Text>
              {new Date(order.deliveredAt).toLocaleString()}
            </Text>
          )}
          <Text style={styles.infoRow}>
            <Text style={styles.label}>Max Life (in hrs): </Text>
            {order.maxLife}
          </Text>
          {order.expiresAt && (
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Expires At: </Text>
              {new Date(order.expiresAt).toLocaleString()}
            </Text>
          )}
        </View>

        {/* Delivery Info */}
        {order.deliveryInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Info</Text>
            {Object.entries(order.deliveryInfo).map(([key, value]) => (
              <Text key={key} style={styles.infoRow}>
                <Text style={styles.label}>{key}: </Text>
                {value}
              </Text>
            ))}
          </View>
        )}

        {/* Products */}
        <View style={{height: 200}}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Products</Text>
            {order.products?.length > 0 ? (
              <ScrollView style={{flex: 1}} nestedScrollEnabled>
                <View>
                  {order.products.map((item, index) => (
                    <View key={index}>{renderProduct({item, index})}</View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.subText}>No products found</Text>
            )}
          </View>
        </View>

        {/* Accepted By */}
        {order.acceptedBy && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Handled By</Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Name: </Text>
              {order.acceptedBy.name || 'N/A'}
            </Text>
            <Text style={styles.infoRow}>
              <Text style={styles.label}>Role: </Text>
              {order.acceptedByType || 'N/A'}
            </Text>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            backgroundColor: colors.oliveGreen,
            paddingHorizontal: 6,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => changeStatus(OrderStatus.ACCEPTED)}
          activeOpacity={0.6}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 16,
              color: currentTheme.contrastColor,
            }}>
            Accept Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            backgroundColor: colors.yellow,
            paddingHorizontal: 6,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => changeStatus(OrderStatus.WAITING)}
          activeOpacity={0.6}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 16,
              color: '#000',
            }}>
            Keep aside
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            backgroundColor: colors.danger,
            paddingHorizontal: 6,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => changeStatus(OrderStatus.REJECTED)}
          activeOpacity={0.6}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 16,
              color: currentTheme.contrastColor,
            }}>
            Reject Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: deviceHeight * 0.75,
    borderRadius: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  customerRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  infoRow: {
    fontSize: 14,
    marginVertical: 2,
    color: '#444',
  },
  label: {
    fontWeight: '600',
    color: '#000',
  },
  subText: {
    fontSize: 13,
    color: '#666',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  value: {
    fontSize: 13,
    color: '#333',
  },
});

export default OrderDetailsContainer;
