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
import {currentTheme} from '../utils/Constants';
import {dashboardHeaderTabs} from '../utils/Constants';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import {navigate} from '../utils/nagivationUtils';

type DashboardHeaderProps = {
  searchBar?: boolean;
  flex?: boolean;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchBar = true,
  flex = true,
}): React.JSX.Element => {
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
          showsVerticalScrollIndicator={false}>
          {dashboardHeaderTabs.map((t, i) => (
            <View key={t.name} style={styles.innerBox}>
              <View style={styles.infoContainer}>
                <Text style={styles.textLabel}>{t.name}</Text>
                <Text
                  style={
                    styles.textInfo
                  }>{`${app.currency}${t.data.amount}`}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {searchBar && (
          <Pressable
            style={styles.searchQueryContainer}
            onPress={() => navigate('Search')}>
            <View style={styles.searchQueryInput}>
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
    backgroundColor: currentTheme.baseColor,
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
    color: currentTheme.contrastColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    color: currentTheme.contrastColor,
    fontSize: 22,
    textAlign: 'center',
  },
  searchQueryContainer: {},
  searchQueryInput: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: currentTheme.baseColor,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  searchQueryInputText: {
    color: currentTheme.textColor,
    fontSize: 18,
  },
});

export default DashboardHeader;
