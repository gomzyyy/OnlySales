import {View, StyleSheet} from 'react-native';
import React from 'react';
import {deviceWidth} from '../../../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../../../hooks/index';

type SearchBarProps = {
  query: string;
  setQuery: (text: string) => void;
  width?: number;
  autoFocus?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  width,
  autoFocus = true,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <View
      style={[
        styles.searchQueryContainer,
        {width: width ? deviceWidth * width : 'auto'},
      ]}>
      <TextInput
        style={[styles.searchQueryInput, {borderColor: currentTheme.baseColor}]}
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name"
        placeholderTextColor={"#000"}
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
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
});

export default SearchBar;
