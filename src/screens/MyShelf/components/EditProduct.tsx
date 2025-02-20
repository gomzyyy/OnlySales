import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { deviceHeight, Theme } from '../../../utils/Constants'
import { TextInput } from 'react-native-gesture-handler'
import { Product } from '../../../../types'
const currentTheme = Theme[0]

type EditProductProps={
    product:Product
}

const EditProduct:React.FC<EditProductProps> = ({product}):React.JSX.Element => {
    const [name,setName]=useState<string>(product.name)
    const [price,setPrice]=useState<string>(product.basePrice)
    const [discountedPrice,setDiscountedPrice]=useState<string>(product.discountedPrice ?? "")
    const [quantity,setQuantity]=useState<string>(product.quantity)
    const [measurementType,setMeasurementType]=useState<string>(product.measurementType)
  return (
     <KeyboardAvoidingView
          style={styles.createCustomerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text style={styles.formTitle}>Edit Product</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.inputLabel}>Product name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.inputText}
                placeholder="Enter name"
                placeholderTextColor={'purple'}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.inputLabel}>Product price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.inputText}
                placeholder="Enter phone number"
                placeholderTextColor={'purple'}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.inputLabel}>Product discounted price</Text>
              <TextInput
                value={discountedPrice}
                onChangeText={setDiscountedPrice}
                style={styles.inputText}
                placeholder="Enter address"
                placeholderTextColor={'purple'}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.inputLabel}>Product quantity</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                style={styles.inputText}
                placeholder="Enter address"
                placeholderTextColor={'purple'}
              />
            </View>
            <View style={styles.inputTitleContainer}>
              <Text style={styles.inputLabel}>Product measurement type</Text>
              <TextInput
                value={measurementType}
                onChangeText={setMeasurementType}
                style={styles.inputText}
                placeholder="Enter address"
                placeholderTextColor={'purple'}
              />
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    height: deviceHeight * 0.75,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    gap: 16,
  },
  inputTitleContainer: {
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '400',
    color: currentTheme.baseColor,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'purple',
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: 'purple',
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
});

export default EditProduct