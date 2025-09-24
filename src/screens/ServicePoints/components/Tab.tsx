import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ServicePoint} from '../../../../types';
import SlideUpContainer from '../../../components/SlideUpContainer';
import {deviceHeight} from '../../../utils/Constants';
import OrderPageRedirectQRCode from '../../../components/OrderPageRedirectORCode';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import Options from './Options';

type ServicePointTabProps = {
  sp: ServicePoint;
};

const Tab: React.FC<ServicePointTabProps> = ({sp}) => {
  const [openOrderOnlineQR, setOpenOrderOnlineQR] = useState<boolean>(false);
    const [openOptions, setOpenOptions] = useState<boolean>(false);
  const closeOrderOnlineQR = () => {
    setOpenOrderOnlineQR(false);
  };

    const handleOpenOptions = (val: boolean) => setOpenOptions(val);
  return (
    <LongPressEnabled
      longPressCanceledAction={()=>handleOpenOptions(true)}
      opacity={0.8}>
      <View style={styles.tile}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
          <Text style={styles.title} numberOfLines={1}>
            {sp.pointName}
          </Text>
          <Text style={[styles.status, getStatusStyle(sp.status)]}>
            {sp.status}
          </Text>
        </View>
        <SlideUpContainer
          open={openOrderOnlineQR}
          close={closeOrderOnlineQR}
          height={deviceHeight * 0.6 < 460 ? 460 : deviceHeight * 0.6}>
          <OrderPageRedirectQRCode spid={sp._id} />
        </SlideUpContainer>
        <SlideUpContainer
          open={openOptions}
          close={() => handleOpenOptions(false)}
          height={deviceHeight * 0.3}>
          <Options />
        </SlideUpContainer>
      </View>
    </LongPressEnabled>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return {color: 'green'};
    case 'INACTIVE':
      return {color: 'grey'};
    case 'MAINTENANCE':
      return {color: 'orange'};
    case 'HIDDEN':
      return {color: 'red'};
    default:
      return {color: 'black'};
  }
};

const styles = StyleSheet.create({
  tile: {
    width: '80%',
    maxWidth: 320,
    height: 280,
    alignSelf: 'center',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Tab;
