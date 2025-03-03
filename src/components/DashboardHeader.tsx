import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import {RootState} from '../../store/store';
import {useSelector} from 'react-redux';
import {dashboardHeaderTabs} from '../utils/Constants';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import {navigate} from '../utils/nagivationUtils';
import useTheme from '../hooks/useTheme';

type DashboardHeaderProps = {
  searchBar?: boolean;
  flex?: boolean;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchBar = true,
  flex = true,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const app = useSelector((s: RootState) => s.shopkeeper.app);
  return (
    <KeyboardAvoidingView
      style={{flex: flex ? 1 : 0}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        <ScrollView
          horizontal={true}
          style={styles.container}
          contentContainerStyle={{gap: 20}}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}>
          {dashboardHeaderTabs.map(t => (
            <View
              key={t.name}
              style={[
                styles.innerBox,
                {backgroundColor: currentTheme.baseColor},
              ]}>
              <View style={styles.infoContainer}>
                <Text
                  style={[
                    styles.textLabel,
                    {color: currentTheme.contrastColor},
                  ]}>
                  {t.name}
                </Text>
                <Text
                  style={[
                    styles.textInfo,
                    {color: currentTheme.contrastColor},
                  ]}>{`${app.currency}${t.data.amount}`}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {searchBar && (
          <Pressable
            style={styles.searchQueryContainer}
            onPress={() => navigate('Search')}>
            <View
              style={[
                styles.searchQueryInput,
                {borderColor: currentTheme.baseColor},
              ]}>
              <Text style={styles.searchQueryInputText}>Search by name</Text>
            </View>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {marginBottom: 20, gap: 6},
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  innerBox: {
    height: 90,
    width: 160,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  textLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    fontSize: 22,
    textAlign: 'center',
  },
  searchQueryContainer: {},
  searchQueryInput: {
    borderWidth: 2,
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

export default DashboardHeader;
