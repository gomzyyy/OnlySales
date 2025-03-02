import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import Header from './components/Header';
import EmptyListMessage from '../../components/EmptyListMessage';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from './components/Tab';

const Search = () => {
  const searchResults = useSelector(
    (s: RootState) => s.shopkeeper.app.searchResults,
  );
  return (
    <View style={styles.parent}>
      <Header backButtom />
      <View style={styles.contentContainer}>
        {searchResults.length === 0 ? (
          <EmptyListMessage title="Try searching by name." />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={s => s.id}
            renderItem={({item}) => <Tab i={item} />}
            nestedScrollEnabled
          />
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
export default Search;
