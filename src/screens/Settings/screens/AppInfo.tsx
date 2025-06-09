import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import Header from '../../../components/Header';
import {useTheme} from '../../../hooks/index';
import {navigate} from '../../../utils/nagivationUtils';
import {APP_NAME,APP_VERSION,APP_SUPPORT_MAIL} from '@env';

type SectionRow = {
  label: string;
  value?: string;
  isPressable?: boolean;
  onPress?: () => void;
};

type Section = {
  title: string;
  description?: string;
  rows: SectionRow[];
};

const warmBackgroundColor = '#fdf6e3';
const borderColor = '#e3d8b8';

const AppInfo = () => {
  const {currentTheme} = useTheme();

  const sections: Section[] = [
    {
      title: 'About the App',
      description: `'${APP_NAME}' helps local sellers manage their finances easily, empowering small businesses to grow. Committed to empowering local businesses in India. Made with ❤️ in your city.`,
      rows: [],
    },
    {
      title: 'Version',
      rows: [{label: 'App Version:', value: `v${APP_VERSION}`}],
    },
    {
      title: 'Developer',
      rows: [
        {label: 'Built By:', value: 'Gomzy Dhingra'},
        {
          label: 'Email:',
          value: `${APP_SUPPORT_MAIL}`,
          isPressable: true,
          onPress: () => {
            Linking.openURL(`mailto:${APP_SUPPORT_MAIL}`);
          },
        },
      ],
    },
    {
      title: 'Support & Feedback',
      rows: [
        {
          label: 'Email us at:',
          value: `${APP_SUPPORT_MAIL}`,
          isPressable: true,
          onPress: () => {
            Linking.openURL(`mailto:${APP_SUPPORT_MAIL}`);
          },
        },
        {label: 'Note:', value: 'Facing issues? Reach out anytime!'},
      ],
    },
    {
      title: 'Legal',
      rows: [
        {
          label: 'Terms & Conditions',
          isPressable: true,
          onPress: () => {
            navigate('TermsAndConditions');
          },
        },
        {
          label: 'Privacy Policy',
          isPressable: true,
          onPress: () => {
            navigate('TermsAndConditions');
          },
        },
        {
          label: 'Note:',
          value: 'All rights reserved. Do not copy or distribute.',
        },
      ],
    },
    {
      title: 'Credits & Thanks',
      rows: [
        {
          label: 'Special thanks:',
          value:
            'To Rajbhallav Kumar.',
        },
      ],
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.parent}>
      <View style={styles.wrapper}>
        <Header name="App info" backButton />
        <ScrollView
          style={{flex: 1, paddingHorizontal: 16}}
          showsVerticalScrollIndicator={false}>
          {sections.map((section, idx) => (
            <View
              key={idx}
              style={[
                styles.sectionContainer,
                {backgroundColor: warmBackgroundColor, borderColor},
              ]}>
              <Text
                style={[styles.sectionTitle, {color: currentTheme.textColor}]}>
                {section.title}
              </Text>
              {section.description && (
                <Text
                  style={[
                    styles.sectionDescription,
                    {color: currentTheme.textAlt, marginBottom: 10},
                  ]}>
                  {section.description}
                </Text>
              )}

              {section.rows.map((row, i) => (
                <Pressable
                  key={i}
                  onPress={
                    row.isPressable && row.onPress ? row.onPress : undefined
                  }
                  style={({pressed}) => [
                    styles.rowContainer,
                    pressed && row.isPressable ? styles.pressed : null,
                  ]}>
                  <Text
                    style={[
                      styles.rowLabel,
                      {color: currentTheme.textColor},
                      row.isPressable && styles.pressableText,
                    ]}>
                    {row.label}
                  </Text>
                  {row.value ? (
                    <View style={{width: '50%'}}>
                      <Text
                        style={[
                          styles.rowValue,
                          {color: currentTheme.textAlt},
                          row.isPressable && styles.pressableText,
                        ]}>
                        {row.value}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: currentTheme.bgColor,
              borderTopColor: currentTheme.borderColor,
            },
          ]}>
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, {color: currentTheme.textAlt}]}>
              App Version: {`v${APP_VERSION}`}
            </Text>
            <Text style={[styles.footerText, {color: currentTheme.textAlt}]}>
              All rights reserved.
            </Text>
          </View>
          <Text style={[styles.loveText, {color: currentTheme.textAlt}]}>
            Built with 💖 by Gomzy Dhingra to support local producers and
            sellers.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  wrapper: {flex: 1},
  sectionContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 16,
  },
  rowValue: {
    fontSize: 16,
  },
  pressableText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.6,
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
  },
  loveText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AppInfo;
