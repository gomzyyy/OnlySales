import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Order} from '../../../../types';
import {useTheme} from '../../../hooks';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import {deviceHeight, deviceWidth} from '../../../utils/Constants';
import SlideUpContainer from '../../../components/SlideUpContainer';
import OrderDetailsContainer from './OrderDetailsContainer';
import {updateOrderStatusAPI} from '../../../api/api.orders';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {OrderStatus} from '../../../../enums';

type TabProps = {
  i: Order;
  lastIndex?: boolean;
  dummy?: boolean;
  showThumbnail?: boolean;
  onInfoChange:()=>void | Promise<void>
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex = false,
  dummy = false,
  showThumbnail = false,
  onInfoChange
}) => {
  const {currency} = useSelector((s:RootState)=>s.appData.app)
  const {currentTheme} = useTheme();
  const [openDataContainer, setOpenDataContainer] = useState(false);
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

  const deliveryAddress =
    i.deliveryInfo?.shortAddress ||
    i.deliveryInfo?.street ||
    i.deliveryInfo?.city ||
    'No address';
  return (
    <LongPressEnabled
      longPressCanceledAction={() =>setOpenDataContainer(true)}
      longPressAction={() => {}}
      dummy={dummy}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 10,
            backgroundColor: currentTheme.tab.bg,
          },
        ]}>
        <View style={styles.topRow}>
          <Text style={[styles.title, {color: currentTheme.baseColor}]}>
            {i.orderedBy?.name || 'Unknown Customer'}
          </Text>
          <View
            style={[
              styles.statusDot,
              {backgroundColor: getStatusColor(i.orderStatus || OrderStatus.PENDING)},
            ]}
          />
        </View>

        <Text style={styles.infoText}>Order ID: order_#{i._id.slice(0,20)}...</Text>
        <Text style={styles.infoText}>Amount: {currency}{i.totalAmount.toFixed(2)}</Text>
        <Text style={[styles.infoText,]}>Status: <Text style={{color:getStatusColor(i.orderStatus || OrderStatus.PENDING),fontWeight:'600'}}>{i.orderStatus || 'N/A'}</Text></Text>
        <Text style={styles.infoText}>
          Ordered At: {new Date(i.orderedAt || '').toDateString()}
        </Text>
        {i.deliveredAt && (
          <Text style={styles.infoText}>
            Delivered: {new Date(i.deliveredAt).toDateString()}
          </Text>
        )}
        <Text style={styles.infoText}>Address: {deliveryAddress}</Text>
      </View>
     
      <SlideUpContainer
        open={openDataContainer}
        close={() => setOpenDataContainer(false)}
        height={deviceHeight * 0.75}>
        <OrderDetailsContainer onOrderStateChange={onInfoChange} order={i} close={() => setOpenDataContainer(false)} />
      </SlideUpContainer>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  container: {
    width: deviceWidth - 28,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,
    color: '#444',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default Tab;
