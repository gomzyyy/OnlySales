import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {navigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks/index';
import {useTranslation} from 'react-i18next';

type SearchBarProps = {
  textColor?: string;
  enable?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  textColor = '#000',
  enable = false,
}): React.JSX.Element => {
  const {t} = useTranslation('customers');
  const {currentTheme} = useTheme();
  return (
    <Pressable
      style={styles.searchQueryContainer}
      onPress={() => enable && navigate('SearchCustomer')}>
      <View
        style={[
          styles.searchQueryInput,
          {
            backgroundColor: currentTheme.fadeColor,
            borderColor: currentTheme.baseColor,
          },
        ]}>
        <Text
          style={[
            styles.searchQueryInputText,
            {color: currentTheme.baseColor},
          ]}>
          {t('cs_header_dummy_searchplaceholder_withdata')}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchQueryContainer: {},
  searchQueryInput: {
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
