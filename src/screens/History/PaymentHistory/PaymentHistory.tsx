import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import {useAnalytics, useCache, useTheme} from '../../../hooks';
import EmptyListMessage from '../../../components/EmptyListMessage';
import Tab from './components/Tab';
import SearchBar from './components/SearchBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PaymentHistory as PaymentHistoryType} from '../../../../types';

const PaymentHistory = () => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryType[]>(
    [],
  );
  const {size,length,getRaw} = useCache();

  useEffect(() => {
    setPaymentHistory(
      [...owner.history.payments]
        .reverse()
        .slice((page - 1) * limit, page * limit),
    );
    console.log(size(),length,getRaw);
  }, [owner, page, limit]);

  useEffect(() => {
    setPaymentHistory(() => {
      if (query.length === 0) {
        return [...owner.history.payments]
          .slice((page - 1) * limit, page * limit)
          .reverse();
      }
      let result: PaymentHistoryType[];
      result = owner.history.payments.filter(s =>
        s.title.toLowerCase().split(' ').includes(query.trim().toLowerCase()),
      );
      return result;
    });
  }, [query]);

  return (
    <View style={{flex: 1, backgroundColor: currentTheme.baseColor}}>
      <Header
        name="Payments History"
        backButton={true}
        titleColor={currentTheme.header.textColor}
      />
      <View style={styles.contentContainer}>
        <View style={{flex: 1}}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              textColor={currentTheme.header.textColor}
              enable={paymentHistory.length !== 0}
              value={query}
              setState={setQuery}
            />
          </View>
          {paymentHistory.length !== 0 ? (
            <FlatList
              data={paymentHistory}
              keyExtractor={s => s._id}
              nestedScrollEnabled
              renderItem={({item, index}) => (
                <Tab i={item} lastIndex={index === paymentHistory.length - 1} />
              )}
              style={{flex: 1, marginBottom: 10, borderRadius: 10}}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{flex: 1}}>
              <EmptyListMessage
                textColor={currentTheme.header.textColor}
                title="No Payment History yet!"
              />
            </View>
          )}
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() =>
                setPage(page => {
                  if (page === 1) {
                    return 1;
                  } else {
                    return page - 1;
                  }
                })
              }>
              <Icon
                name="arrow-back-ios"
                size={16}
                color={currentTheme.contrastColor}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: currentTheme.contrastColor,
              }}>
              {limit * page > owner.history.payments.length
                ? owner.history.payments.length
                : limit * page}{' '}
              of {owner.history.payments.length}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setPage(page + 1)}>
              <Icon
                name="arrow-forward-ios"
                size={16}
                color={currentTheme.contrastColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {paddingVertical: 20},
  contentContainer: {flex: 1, paddingHorizontal: 16},
});

export default PaymentHistory;
