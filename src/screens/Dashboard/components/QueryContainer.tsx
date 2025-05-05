import {View, Text, ScrollView, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import useQuery from '../hooks/hooks';

type QueryContainerProps = {
  close?: any;
};

const QueryContainer: React.FC<QueryContainerProps> = ({
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [query, setQuery] = useState<string>('');
  const {
    customersByQuery,
    CustomerTab,
    soldProductsByQueryDate,
    DateWithSoldProductTab,
    message,
    foundInventory,
    InventoryProductTab,
  } = useQuery({query, close});

  return (
    <View
      style={{
        minHeight: deviceHeight * 0.36,
        height: 'auto',
        backgroundColor: currentTheme.contrastColor,
        marginBottom: 10,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Text style={{fontSize: 20, fontWeight: 600, textAlign: 'center'}}>
          Run a Query
        </Text>
        <View style={{justifyContent: 'center'}}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            style={[
              styles.inputText,
              {borderColor: currentTheme.modal.inputBorder},
            ]}
            placeholder="enter your query"
            placeholderTextColor={'grey'}
          />
          <Text style={{fontSize: 12, fontWeight: '600', paddingLeft: 14}}>
            {message || 'test message'}
          </Text>
        </View>

        {customersByQuery.length > 0 && (
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 16, fontWeight: 600, paddingLeft: 20}}>
              Found customers:
            </Text>
            {customersByQuery.map(s => (
              <CustomerTab key={s._id} customer={s} />
            ))}
          </View>
        )}
        {soldProductsByQueryDate.length !== 0 && (
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 16, fontWeight: 600, paddingLeft: 20}}>
              Found records:
            </Text>
            {soldProductsByQueryDate.map(s => (
              <DateWithSoldProductTab key={s.date} data={s} />
            ))}
          </View>
        )}
        {foundInventory.length > 0 && (
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 16, fontWeight: 600, paddingLeft: 20}}>
              Found records:
            </Text>
            {foundInventory.map(s => (
              <InventoryProductTab product={s} theme={currentTheme} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
    marginTop: 24,
    width: '100%',
  },
});
export default QueryContainer;
