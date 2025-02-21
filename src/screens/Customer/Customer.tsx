import {View, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import {useRoute} from '@react-navigation/native';
import {Customer as CustomerType} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {ToogleButton} from './components/Tab';
import {currentTheme} from '../../utils/Constants';
import {ProductsByDate} from '../../components/shared/ProductByDate';
import CustomerInfo from './components/CustomerInfo';
import EmptyListMessage from '../../components/EmptyListMessage';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddUdhar from './components/AddUdhar';


type RouteParams = {
  customer: CustomerType;
};
const Customer = () => {
  const params = useRoute().params;
  const {customer} = params as RouteParams;
  const [content, setContent] = useState<'PAID' | 'UNPAID'>('UNPAID');
  const [addUdhar, setAddUdhar] = useState<boolean>(false);

  const openAddUdharModal=()=>setAddUdhar(true)
  const closeAddUdharModal=()=>setAddUdhar(false)
  
  return (
    <View style={styles.parent}>
      <Header
        name={`${customer.fullName}`}
        backButtom
        customComponent={true}
        renderItem={<Icon name="plus" color={'black'} size={24} />}
        customAction={openAddUdharModal}
      />
      <View style={styles.contentContainer}>
        <CustomerInfo customer={customer} />
        <View style={styles.contentToggleContainer}>
          <Pressable onPress={() => setContent('UNPAID')} style={{flex: 1}}>
            <ToogleButton
              title="Unpaid Udhars"
              bgcolor={content === 'UNPAID' ? currentTheme.tabColor : ''}
              textColor={content === 'UNPAID' ? currentTheme.contrastColor : ''}
            />
          </Pressable>
          <Pressable onPress={() => setContent('PAID')} style={{flex: 1}}>
            <ToogleButton
              title="Paid Udhars"
              bgcolor={content === 'PAID' ? currentTheme.toggleBtn.bgActive : ''}
              textColor={content === 'PAID' ? currentTheme.contrastColor : ''}
            />
          </Pressable>
        </View>
        <View style={styles.dataContainer}>
          {content === 'UNPAID' ? (
            customer.unpaidPayments && customer.unpaidPayments.length !== 0 ? (
              <ProductsByDate
                customer={customer}
                ArrWithDate={customer.unpaidPayments}
              />
            ) : (
              <EmptyListMessage title="Oops! No unpaid payments." />
            )
          ) : customer.paidPayments && customer.paidPayments.length !== 0 ? (
            <ProductsByDate
              customer={customer}
              ArrWithDate={customer.paidPayments}
            />
          ) : (
            <EmptyListMessage title="Oops! No paid payments." />
          )}
        </View>
      </View>
      <SlideUpContainer open={addUdhar} close={closeAddUdharModal}>
      <AddUdhar />
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  customerInfoContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    overflow: 'hidden',
    borderRadius: '50%',
    backgroundColor: 'red',
  },
  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'contain',
  },
  contentToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 40,
    gap: 10,
  },
  toogleBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentToggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dataContainer: {
    marginTop: 20,
  },
});

export default Customer;
