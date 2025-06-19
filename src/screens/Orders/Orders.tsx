import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useTheme, useAnalytics, useStorage} from '../../hooks';
import Tab from './components/Tab';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {
  handleOrders,
  resetEventCount,
  resetOrderCount,
} from '../../../store/slices/events';

const Orders = () => {
  const d = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const {user} = useSelector((s: RootState) => s.appData)!;
  if (!user) {
    return null;
  }
  const {getOrders} = useStorage().user;
  const [loading, setLoading] = useState<boolean>(false);
  const {orderData} = useSelector((s: RootState) => s.events);
  const fetchOrders = async () => {
    const data = {
      query: {
        role: user.role,
        oid: owner._id,
      },
    };
    const res = await getOrders(data, setLoading);
    if (res.success && res.data && res.data.orders) {
      d(handleOrders(res.data.orders));
    }
  };
  useEffect(() => {
    let isMount: boolean = true;
    if (isMount) {
      d(resetOrderCount());
    }
    fetchOrders();
  }, []);
  return (
    <View style={styles.parent}>
      <Header
        name="Orders"
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.contrastColor}
        curved
        backButton
      />
      <View style={styles.contentContainer}>
        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator
              size={50}
              color={currentTheme.baseColor}
              style={{marginBottom: 80}}
            />
          </View>
        ) : orderData.orders.length === 0 ? (
          <View
            style={{
              backgroundColor: currentTheme.fadeColor,
              borderRadius: 20,
              padding: 10,
              gap: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: currentTheme.baseColor,
                textAlign: 'center',
              }}>
              No recent orders...
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                borderRadius: 20,
                padding: 2,
                gap: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: currentTheme.baseColor,
                  textAlign: 'center',
                }}>
                click to see details
              </Text>
            </View>
            <FlatList
              data={[...(orderData.orders || [])].reverse()}
              keyExtractor={s => s._id}
              renderItem={({item, index}) => (
                <Tab
                  i={item}
                  lastIndex={orderData.orders.length - 1 === index}
                  key={item._id}
                />
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  contentContainer: {flex: 1, marginTop: 2, paddingHorizontal: 10},
});

export default Orders;
