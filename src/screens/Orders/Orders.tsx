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
import {handleOrders, resetOrderCount} from '../../../store/slices/events';
import FallbackMessage from '../../components/FallbackMessage';
import HeaderIcon from '../../components/HeaderIcon';

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
        customComponent={true}
        renderItem={
          <HeaderIcon iconColor={currentTheme.baseColor}>
            {loading ? (
              <ActivityIndicator size={28} color={currentTheme.contrastColor} />
            ) : null}
          </HeaderIcon>
        }
      />
      <View style={styles.contentContainer}>
       {orderData.orders.length === 0 ? (
          <FallbackMessage text="No Recent orders..." />
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
                  onInfoChange={fetchOrders}
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
