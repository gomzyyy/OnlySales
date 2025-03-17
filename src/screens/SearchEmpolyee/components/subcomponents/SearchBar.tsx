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
  shadow?: number;
  placeholderText?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  width,
  autoFocus = true,
  shadow = 5,
  placeholderText = 'Search here',
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <View
      style={[
        styles.searchQueryContainer,
        {
          width: width ? deviceWidth * width : 'auto',
        },
      ]}>
      <TextInput
        style={[
          styles.searchQueryInput,
          {
            borderColor: currentTheme.baseColor,
            color: currentTheme.baseColor,
            backgroundColor: currentTheme.contrastColor,
            elevation: shadow,
          },
        ]}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholderText}
        placeholderTextColor={currentTheme.baseColor}
        autoFocus={autoFocus}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  searchQueryContainer: {},
  searchQueryInput: {
    borderRadius: 8,
    height: 45,
    fontSize: 20,
    paddingHorizontal: 12,
    width: 'auto',
  },
});

export default SearchBar;
