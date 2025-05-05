import {View, StyleSheet} from 'react-native';
import React from 'react';
import {deviceWidth} from '../../../../utils/Constants';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../../../hooks/index';
import { useTranslation } from 'react-i18next';

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
  placeholderText,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
 const {t} = useTranslation('dashboard')

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
        placeholder={t('d_header_dummy_searchplaceholder')}
        placeholderTextColor={currentTheme.baseColor}
        autoFocus={autoFocus}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  searchQueryContainer: {
    justifyContent:'center'
  },
  searchQueryInput: {
    borderRadius: 8,
    height: 45,
    fontSize: 16,
    paddingHorizontal: 12,
    width: 'auto',
  },
});

export default SearchBar;
