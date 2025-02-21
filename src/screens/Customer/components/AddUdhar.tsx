import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {currentTheme, deviceHeight} from '../../../utils/Constants';

const AddUdhar = () => {
  return (
    <KeyboardAvoidingView
      style={styles.addUdharContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Add new Product</Text>
      <View style={styles.productsContainer}>
        <TouchableOpacity style={styles.doneAdding} activeOpacity={0.8}>
          <Text style={styles.doneAddingText}>Done adding</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  addUdharContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.75,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  title: {},
  productsContainer: {},
  doneAdding: {},
  doneAddingText: {},
});

export default AddUdhar;
