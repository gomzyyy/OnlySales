import {View, StyleSheet, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {back} from '../../../utils/nagivationUtils';
import SearchBar from './subcomponents/SearchBar';
import {Customer} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {
  setSearchResult,
  resetSearchResults,
} from '../../../../store/slices/shopkeeper';

type HeaderProps = {
  searchBar?: boolean;
  backButtom?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  searchBar = true,
  backButtom = false,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector(
    (s: RootState) => s.shopkeeper.shopkeeper.customers,
  );
  const [query, setQuery] = useState<string>('');
  const clearSearchText = () => setQuery('');

  const handleSearchQuery = () => {
    let result: Customer[] = [];
    if (customers.length !== 0) {
      result = customers.filter(s =>
        s.name.trim().toLowerCase().includes(query.trim().toLowerCase()),
      );
    }
    result.length !== 0 && dispatch(setSearchResult(result));
  };
  useEffect(() => {
    if (query.trim().length !== 0) {
      handleSearchQuery();
    } else {
      dispatch(resetSearchResults());
    }
    return () => {
      dispatch(resetSearchResults());
    };
  }, [query]);

  return (
    <View
      style={{
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
      }}>
      {backButtom && (
        <Pressable style={styles.leftActionBtn} onPress={() => back()}>
          <Icon1 name="left" size={24} color={'black'} />
        </Pressable>
      )}
      {searchBar && <SearchBar query={query} setQuery={setQuery} width={0.7} />}
      {query.trim().length !== 0 && (
        <Pressable onPress={clearSearchText} style={styles.rightCustomBtn}>
          <Icon2 name="clear" size={24} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  leftActionBtn: {
    position: 'absolute',
    left: 20,
  },
  rightCustomBtn: {
    position: 'absolute',
    right: 20,
  },
});

export default Header;
