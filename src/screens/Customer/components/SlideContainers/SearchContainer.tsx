import {View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceHeight} from '../../../../utils/Constants';
import {useTheme} from '../../../../hooks';
import {Customer, SoldProduct} from '../../../../../types';
import {ProductsByDate} from '../../../../components/shared/ProductByDate';
import {months} from '../../constants/fn';

type SearchContainerProps = {
  customer: Customer;
  onTabPress: ({
    products,
    customer,
    date,
  }: {
    products: SoldProduct[];
    customer: Customer;
    date: string;
  }) => void;
  close: () => void;
};

const SearchContainer: React.FC<SearchContainerProps> = ({
  customer,
  onTabPress,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<SoldProduct[]>(customer.buyedProducts);

  const findByQuery = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      setResult(customer.buyedProducts);
      return;
    }

    const [day, rawMonth, year] = trimmedQuery.split(' ');
    const monthNum = rawMonth ? months[rawMonth] : null;
    const filtered = customer.buyedProducts.filter(product => {
      const soldDate = new Date(product.updatedAt);
      const soldDay = soldDate.getDate().toString();
      const soldMonth = months[(soldDate.getMonth() + 1).toString()];
      const soldYear = soldDate.getFullYear().toString();
      const matchDay = !day || day === soldDay;
      const matchMonth = !monthNum || monthNum === soldMonth;
      const matchYear = !year || year === soldYear;

      return matchDay && matchMonth && matchYear;
    });

    setResult(filtered);
  };

  useEffect(() => {
    findByQuery();
  }, [query, customer]);

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <View
        style={[styles.inputContainer, {borderColor: currentTheme.baseColor}]}>
        <TextInput
          style={[styles.textInput, {color: currentTheme.baseColor}]}
          value={query}
          onChangeText={setQuery}
          placeholder="dd mm yyyy"
          placeholderTextColor="#ababab"
        />
        {query.trim().length > 0 && (
          <TouchableOpacity activeOpacity={0.6} style={styles.clearButton} onPress={() => setQuery('')}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{marginTop: 20, flex: 1}}>
        <ProductsByDate
          customer={customer}
          ArrWithDate={result}
          onTabPress={onTabPress}
        />
      </View>
      <Text style={{fontWeight: '600', textAlign: 'center', marginTop: 10}}>
        {'example:- 01 jan 1970'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 6,
    paddingHorizontal: 10,
    height: deviceHeight * 0.6,
    marginBottom: 10,
    borderRadius: 20,
  },
  inputContainer: {
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 2,
    padding:2
  },
  textInput: {
    flex: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  clearButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius:12
  },
  clearText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
    fontStyle: 'italic',
  },
});

export default SearchContainer;
