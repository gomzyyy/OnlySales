import {View, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import Header from './components/Header';
import EmptyListMessage from '../../components/EmptyListMessage';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from '../Customers/components/Tab';
import {useTheme} from '../../hooks';
import {deviceHeight} from '../../utils/Constants';
import {Text} from 'react-native';

const Search = () => {
  const {currentTheme} = useTheme();
  const searchResults = useSelector(
    (s: RootState) => s.shopkeeper.app.searchResults,
  );
  return (
    <View style={styles.parent}>
      <Header backButtom />
      <View style={[styles.contentContainer]}>
        {searchResults.length === 0 ? (
          <EmptyListMessage title="Try searching by name." />
        ) : (
          <View
            style={{
              height: 'auto',
              minHeight: deviceHeight * 0.2,
              backgroundColor: currentTheme.baseColor,
              borderRadius: 20,
              padding: 15,
              gap: 10,
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
              data={searchResults}
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
export default Search;
