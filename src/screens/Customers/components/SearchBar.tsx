import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {navigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks/index';

const SearchBar = () => {
  const {currentTheme} = useTheme();
  return (
    <Pressable
      style={styles.searchQueryContainer}
      onPress={() => navigate('Search')}>
      <View
        style={[
          styles.searchQueryInput,
          {borderColor: currentTheme.baseColor},
        ]}>
        <Text style={styles.searchQueryInputText}>Search by name</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchQueryContainer: {},
  searchQueryInput: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  searchQueryInputText: {
    fontSize: 18,
  },
});

export default SearchBar;
