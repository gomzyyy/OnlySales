import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import {Pressable} from 'react-native';
import {back} from '../../utils/nagivationUtils';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../hooks';
import {colors, KEYWORDS, RESERVED_KEYWORDS} from '../../utils/Constants';

const ReservedKeywords = () => {
  const {currentTheme} = useTheme();
  return (
    <SafeAreaView
      style={[styles.screen, {backgroundColor: currentTheme.contrastColor}]}>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Pressable onPress={() => back()} style={{marginBottom: 50}}>
            <Icon1 name="left" size={24} />
          </Pressable>
          <View>
            <Text style={[styles.heading, {color: currentTheme.textColor}]}>
              Reserved Keywords
            </Text>
            <Text
              style={[
                styles.subText,
                {color: currentTheme.textAlt, paddingRight: 20},
              ]}>
              These are reserved commands and cannot be used for creating custom
              items.
            </Text>
          </View>
        </View>

        {/* Your Custom Explanation Placeholder */}
        <Text style={[styles.customNote, {color: currentTheme.textAlt}]}>
          {/* ✍️ You can explain the limitations here. For example: */}
          {/* Avoid using these keywords in input fields or IDs as they are used internally for core functionality. */}
        </Text>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.block,
              {
                backgroundColor: colors.dangerFade,
                borderColor: colors.danger,
              },
            ]}>
            <Text style={[styles.category, {color: colors.danger}]}>
              ALL RESERVED
            </Text>
            {RESERVED_KEYWORDS.map(keyword => (
              <Text
                key={keyword}
                style={[styles.reservedItem, {color: colors.danger}]}>
                • {keyword}
              </Text>
            ))}
            {/* <Text
              style={[
                styles.reservedItem,
                {color: colors.danger, textAlign: 'center',fontWeight:'600'},
              ]}>
              "Add 'ex' at the end of query to execute"
            </Text> */}
          </View>
          {Object.entries(KEYWORDS).map(([category, value]) => {
            if (category === 'reserved') return null;

            const methods = 'methods' in value ? value.methods : value;
            return (
              <View
                key={category}
                style={[
                  styles.block,
                  {
                    backgroundColor: currentTheme.fadeColor,
                    borderColor: currentTheme.baseColor,
                  },
                ]}>
                <Text
                  style={[styles.category, {color: currentTheme.baseColor}]}>
                  {category.toUpperCase()}
                </Text>
                <Text
                  style={[styles.description, {color: currentTheme.textAlt}]}>
                  {value.description}
                </Text>

                {Object.entries(methods).map(([method, methodData]) => (
                  <View key={method} style={styles.methodBlock}>
                    <Text
                      style={[
                        styles.methodTitle,
                        {color: currentTheme.tabColor},
                      ]}>
                      → {method}
                    </Text>
                    <Text
                      style={[
                        styles.methodDesc,
                        {color: currentTheme.textColor},
                      ]}>
                      {methodData.description}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    marginBottom: 10,
  },
  customNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  block: {
    marginBottom: 25,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  category: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  methodBlock: {
    marginLeft: 10,
    marginTop: 8,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodDesc: {
    fontSize: 13,
    marginLeft: 10,
  },
  reservedItem: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default ReservedKeywords;
