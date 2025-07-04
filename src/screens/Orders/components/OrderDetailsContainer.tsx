import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Order, Product} from '../../../../types';
import {useStorage, useTheme} from '../../../hooks';
import {colors, deviceHeight} from '../../../utils/Constants';
import {OrderStatus, ProductType} from '../../../../enums';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {updateOrderStatusAPI} from '../../../api/api.orders';
import {sellProductAPI} from '../../../api/api.soldproduct';
import {showToast} from '../../../service/fn';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';
import {handleOrders} from '../../../../store/slices/events';
const NoPhoto = require('../../../assets/images/no-profile.jpg');

type Props = {
  order: Order;
  close?: () => void;
  onOrderStateChange: () => void | Promise<void>;
};

const OrderDetailsContainer: React.FC<Props> = ({order, close}) => {
  const d = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {getOrders} = useStorage().user;
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
      <Text style={styles.value}>
        {item.product.productType === ProductType.PHYSICAL
          ? `Qty: ${item.count * item.product.quantity}`
          : `${item.count * item.product.quantity} Service(s)`}
      </Text>
    </View>
  );

  const fetchOrders = async () => {
    const data = {
      query: {
        role: user.role,
        oid: order.ownerId,
      },
    };
    const res = await getOrders(data, setLoading);
    if (res.success && res.data && res.data.orders) {
      d(handleOrders(res.data.orders));
    }
  };

  const CreateSoldProductCase = [OrderStatus.ACCEPTED];
  const changeStatus = async (updatedStatus: OrderStatus) => {
    setLoading(true);
    const spIds: string[] = [];
    let atLeastOneSuccess = false;
    try {
      const res = await updateOrderStatusAPI(
        {
          query: {
            role: user.role,
            updatedStatus,
          },
          body: {
            order: order._id,
          },
        },
        setLoading,
      );

      if (!res.success) {
        showToast({
          type: 'error',
          text1: res.message || 'Failed to update order status.',
        });
        return;
      }
      if (CreateSoldProductCase.includes(updatedStatus)) {
        for (const p of order.products) {
          if (!p.product || p.count <= 0) continue;

          const sellData = {
            query: {
              buyerId: order.orderedBy._id,
              sellerId: user._id,
              role: user.role,
              orderStatus: OrderStatus.COMPLETED,
            },
            body: {
              productId: p.product._id,
              count: p.count,
            },
          };
          const sellRes = await sellProductAPI(sellData);
          if (sellRes.success) {
            atLeastOneSuccess = true;
            const soldId = sellRes.data?.soldProduct?._id;
            if (soldId) spIds.push(soldId);
          } else {
            console.warn('Failed to sell product:', p.product._id);
          }
        }
        if (!atLeastOneSuccess) {
          showToast({
            type: 'info',
            text1: 'Could not register sold products for this order.',
          });
          return;
        }
        showToast({
          type: 'success',
          text1: 'Order status updated successfully.',
        });
      } else {
        await fetchOrders();
        showToast({
          type: 'success',
          text1: 'Order status updated successfully.',
        });
      }
      close && close();
    } catch (error) {
      showToast({
        type: 'error',
        text1: 'An unexpected error occurred while updating order.',
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return 'green';
      case 'COMPLETED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'WAITING':
        return 'orange';
      case 'FAILED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return '#666';
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
            <Text
              style={{
                color: getStatusColor(order.orderStatus || OrderStatus.PENDING),
                fontWeight: '600',
              }}>
              {order.orderStatus || 'N/A'}
            </Text>
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
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{gap: 18, justifyContent: 'space-evenly'}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {order.orderStatus !== OrderStatus.ACCEPTED ||
            (OrderStatus.REJECTED && (
              <ActionButton
                status={OrderStatus.ACCEPTED}
                onStatusUpdate={changeStatus}
                bgcolor={'green'}
                textcolor={currentTheme.contrastColor}
                text="Accept?"
              />
            ))}
          {order.orderStatus !== OrderStatus.WAITING ||
            (OrderStatus.REJECTED && (
              <ActionButton
                status={OrderStatus.WAITING}
                onStatusUpdate={changeStatus}
                bgcolor={'orange'}
                textcolor={currentTheme.contrastColor}
                text="Set to Waiting"
              />
            ))}
          {order.orderStatus !== OrderStatus.READY ||
            (OrderStatus.REJECTED && (
              <ActionButton
                status={OrderStatus.READY}
                onStatusUpdate={changeStatus}
                bgcolor={colors.oliveGreen}
                textcolor={currentTheme.contrastColor}
                text="Ready?"
              />
            ))}
          {order.orderStatus !== OrderStatus.REJECTED && (
            <ActionButton
              status={OrderStatus.REJECTED}
              onStatusUpdate={changeStatus}
              bgcolor={colors.danger}
              textcolor={currentTheme.contrastColor}
              text="Reject?"
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

type ButtonProps = {
  onStatusUpdate: (updatedStatus: OrderStatus) => void | Promise<void>;
  status: OrderStatus;
  bgcolor: string;
  textcolor: string;
  text: string;
  loading?: boolean;
};
const ActionButton: React.FC<ButtonProps> = ({
  onStatusUpdate,
  bgcolor,
  textcolor,
  status,
  text,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        backgroundColor: bgcolor,
        paddingHorizontal: 6,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 120,
      }}
      onPress={() => onStatusUpdate(status)}
      disabled={loading}
      activeOpacity={0.6}>
      <Text
        style={{
          fontWeight: '600',
          fontSize: 16,
          color: textcolor,
        }}
        numberOfLines={1}>
        {text}
      </Text>
    </TouchableOpacity>
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
