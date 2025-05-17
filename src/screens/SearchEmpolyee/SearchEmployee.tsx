import {View, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import Header from './components/Header';
import EmptyListMessage from '../../components/EmptyListMessage';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from '../Customers/components/Tab';
import {useTheme} from '../../hooks';
import {Text} from 'react-native';

const SearchEmployee = () => {
  const {currentTheme} = useTheme();
  const employeeResults = useSelector(
    (s: RootState) => s.appData.app.searchResults.employeeResults,
  );
  return (
    <View style={styles.parent}>
      <Header backButton />
      <View style={[styles.contentContainer]}>
        {employeeResults.length === 0 ? (
          <EmptyListMessage title="Try searching by name." />
        ) : (
          <View
            style={{
              height: 'auto',
              backgroundColor: currentTheme.baseColor,
              borderRadius: 20,
              padding: 15,
              gap: 10,
              elevation: 5,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: currentTheme.header.textColor,
              }}>
              Results:
            </Text>
            <FlatList
              data={employeeResults}
              keyExtractor={s => s.id}
              renderItem={({item}) => <Tab i={item} />}
              nestedScrollEnabled
            />
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});
export default SearchEmployee;
