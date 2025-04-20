import {View, Text, Pressable, StyleSheet, TextInput} from 'react-native';
import React, {SetStateAction} from 'react';
import {useTheme} from '../../../hooks';
import {navigate} from '../../../utils/nagivationUtils';
import {Dispatch} from '@reduxjs/toolkit';

type SearchToolsProps = {
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  close?:()=>void
};

const SearchTools: React.FC<SearchToolsProps> = ({
  value,
  setValue,
  close
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <View style={{paddingHorizontal: 10}}>
      <View
        style={[
          styles.searchQueryContainer,
          {backgroundColor: currentTheme.contrastColor},
        ]}>
        <View
          style={[
            styles.searchQueryInput,
            {borderColor: currentTheme.baseColor},
          ]}>
          <TextInput
            style={[
              styles.searchQueryInputText,
              {color: currentTheme.baseColor},
            ]}
            value={value}
            onChangeText={setValue}
            placeholder="Search Tools & Features"
            placeholderTextColor={currentTheme.baseColor}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchQueryContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 20,
    elevation: 10,
  },
  searchQueryInput: {
    borderWidth: 2,
    borderRadius: 14,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  searchQueryInputText: {
    fontSize: 18,
  },
});

export default SearchTools;
