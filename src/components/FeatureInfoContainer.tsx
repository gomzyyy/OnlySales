import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {ReactNode} from 'react';
import {deviceHeight} from '../utils/Constants';
import {useTheme} from '../hooks';

type InfoContextType = {
  label: string;
  text1?: string;
  text2?: string;
  text3?: string;
};

type FeatureInfoContainerProps = {
  info?: InfoContextType;
  customised?: boolean;
  renderItem?: ReactNode;
};

const FeatureInfoContainer: React.FC<FeatureInfoContainerProps> = ({
  info,
  customised = false,
  renderItem = <></>,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      {customised ? (
        renderItem
      ) : info ? (
        <View style={styles.content}>
          <Text style={[styles.label, {color: currentTheme.textColor}]}>
            {info.label}
          </Text>
          <ScrollView
            style={{flex: 1}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.detailSection}>
              {info.text1 && (
                <Text
                  style={[styles.textItem, {color: currentTheme.textColor}]}>
                  {`\u2022 `}
                  <Text style={styles.textContent}>{info.text1}</Text>
                </Text>
              )}
              {info.text2 && (
                <Text
                  style={[styles.textItem, {color: currentTheme.textColor}]}>
                  {`\u2022 `}
                  <Text style={styles.textContent}>{info.text2}</Text>
                </Text>
              )}
              {info.text3 && (
                <Text
                  style={[styles.textItem, {color: currentTheme.textColor}]}>
                  {`\u2022 `}
                  <Text style={styles.textContent}>{info.text3}</Text>
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.35,
    marginBottom: 10,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flex: 1,
  },
  label: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  detailSection: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: 10,
  },
  textItem: {
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: '500',
    paddingLeft: 4,
  },
  textContent: {
    fontWeight: '400',
    letterSpacing: 0.2,
    color: '#7e7e7e',
  },
});

export default FeatureInfoContainer;
