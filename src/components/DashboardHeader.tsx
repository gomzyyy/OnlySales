import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppDispatch, RootState} from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {setSearchResult} from '../../store/slices/shopkeeper';
import {Customer} from '../../types';
import {Theme} from '../utils/Constants';

const currentTheme = Theme[0];

type DashboardHeaderProps = {
  searchBar?: boolean;
  flex?: boolean;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchBar = true,
  flex = true,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const c = useSelector((s: RootState) => s.shopkeeper.shopkeeper.customers);
  const currencyType = useSelector((s: RootState) => s.shopkeeper.app.currency);
  const [query, setQuery] = useState<string>('');
  const handleSearchQuery = () => {
    let result: Customer[] = [];
    if (c.length !== 0) {
      result = c.filter(s =>
        s.fullName.trim().toLowerCase().includes(query.trim().toLowerCase()),
      );
    }
    result.length !== 0 && dispatch(setSearchResult(result));
  };
  useEffect(() => {
    handleSearchQuery();
  }, [query]);
  return (
    <KeyboardAvoidingView
      style={{flex: flex ? 1 : 0}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        <View style={styles.container}>
          <View style={styles.innerBox}>
            <View style={styles.infoContainer}>
              <Text style={styles.textLabel}>This Month</Text>
              <Text style={styles.textInfo}>{`${currencyType}18273`}</Text>
            </View>
          </View>
          <View style={styles.innerBox}>
            <View style={styles.infoContainer}>
              <Text style={styles.textLabel}>Today</Text>
              <Text style={styles.textInfo}>{`${currencyType}1297`}</Text>
            </View>
          </View>
        </View>
        {searchBar && (
          <View style={styles.searchQueryContainer}>
            <TextInput
              style={styles.searchQueryInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name"
              placeholderTextColor={'purple'}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {marginBottom: 20, gap: 6},
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor:currentTheme.bgColor
  },
  innerBox: {
    height: 90,
    width: 160,
    backgroundColor: currentTheme.baseColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  textLabel: {
    color: currentTheme.contrastColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    color: currentTheme.contrastColor,
    fontSize: 22,
    textAlign: 'center',
  },
  searchQueryContainer: {},
  searchQueryInput: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: currentTheme.baseColor,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
});

export default DashboardHeader;
