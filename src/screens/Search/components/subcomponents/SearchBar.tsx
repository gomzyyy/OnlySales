import {View, StyleSheet} from 'react-native';
import React from 'react';
import {currentTheme, deviceWidth} from '../../../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';

type SearchBarProps = {
  query: string;
  setQuery: (text: string) => void;
  width?: number;
  autoFocus?:boolean
};

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  width,
  autoFocus=true
}): React.JSX.Element => {
  return (
    <View style={[styles.searchQueryContainer, {width: width ? deviceWidth * width : "auto"}]}>
      <TextInput
        style={styles.searchQueryInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name"
        placeholderTextColor={currentTheme.textColor}
        autoFocus={autoFocus}
      />
    </View>
  );
};
const styles = StyleSheet.create({
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

export default SearchBar;
