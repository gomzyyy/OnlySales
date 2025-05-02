import {View, Text, ScrollView, TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import useQuery from '../hooks/hooks';

type QueryContainerProps = {};

const QueryContainer: React.FC<QueryContainerProps> = (): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [query, setQuery] = useState<string>('');
  const {
    customersByQuery,
    CustomerTab,
    soldProductsByQueryDate,
    DateWithSoldProductTab,
  } = useQuery({query});

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
    marginTop: 30,
  },
});
export default QueryContainer;
