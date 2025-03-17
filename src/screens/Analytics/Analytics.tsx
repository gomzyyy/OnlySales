import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import {useTheme} from '../../hooks';

const Analytics = () => {
  const {currentTheme} = useTheme();
  return (
    <View style={[styles.parent, {backgroundColor: currentTheme.baseColor}]}>
      <Header
        titleColor={currentTheme.header.textColor}
        name="Analytics"
        headerBgColor={currentTheme.baseColor}
        backButtom={true}
      />
      <Text style={{textAlign: 'center', color: currentTheme.contrastColor}}>
        Analytics
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
});

export default Analytics;
