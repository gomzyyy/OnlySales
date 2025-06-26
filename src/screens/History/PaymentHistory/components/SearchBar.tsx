import {View, Text, Pressable, StyleSheet, TextInput} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {navigate} from '../../../../utils/nagivationUtils';
import {useTheme} from '../../../../hooks';

type SearchBarProps = {
  textColor?: string;
  enable?: boolean;
  value: string;
  setState: Dispatch<SetStateAction<string>>;
};

const SearchBar: React.FC<SearchBarProps> = ({
  textColor = '#000',
  enable = false,
  value,
  setState
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <Pressable
      style={styles.searchQueryContainer}
      onPress={() => enable && navigate('SearchEmployee')}>
      <TextInput
        style={[
          styles.searchQueryInput,
          {backgroundColor: currentTheme.fadeColor},
        ]}
        value={value}
        onChangeText={setState}
        placeholder={enable ? 'Search History' : 'No History yet.'}
        placeholderTextColor={currentTheme.baseColor}
        />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchQueryContainer: {},
  searchQueryInput: {
    // borderWidth: 2,
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
