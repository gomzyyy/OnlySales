import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {RootState} from '../../store/store';
import {useSelector} from 'react-redux';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import {useTheme, useAnalytics} from '../hooks/index';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

type DashboardHeaderProps = {
  searchBar?: boolean;
  flex?: boolean;
  searchBarPressAction?: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchBar = true,
  flex = true,
  searchBarPressAction,
}): React.JSX.Element => {
  const {t} = useTranslation('dashboard');
  const {currentTheme} = useTheme();
  const {soldThisMonth = [], todaySales = []} = useAnalytics();
  const app = useSelector((s: RootState) => s.appData.app);
  const totalMonthlySales = useMemo(
    () =>
      soldThisMonth.reduce(
        (acc, s) =>
          acc +
          ((s.product.discountedPrice
            ? s.product.discountedPrice
            : s.product.basePrice) * s.count || 0),
        0,
      ),
    [soldThisMonth],
  );
  const onGoingDaySales = useMemo(
    () =>
      todaySales.reduce(
        (acc, s) =>
          acc +
          ((s.product.discountedPrice
            ? s.product.discountedPrice
            : s.product.basePrice) * s.count || 0),
        0,
      ),
    [todaySales],
  );
  const [monthlySales, setMonthlySales] = useState<number>(totalMonthlySales);
  const [todaySalesNum, setTodaySalesNum] = useState<number>(onGoingDaySales);

  const updateSalesCount = useCallback(() => {
    setMonthlySales(totalMonthlySales);
    setTodaySalesNum(onGoingDaySales);
  }, [totalMonthlySales, onGoingDaySales]);

  useFocusEffect(
    useCallback(() => {
      updateSalesCount();
    }, [updateSalesCount]),
  );

  const dashboardHeaderTabs = [
    {name: t('d_header_thismonth'), data: {amount: '18273'}},
    {name: t('d_header_today'), data: {amount: '1297'}},
  ];

  return (
    <KeyboardAvoidingView
      style={{flex: flex ? 1 : 0}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        <ScrollView
          horizontal={true}
          style={styles.container}
          contentContainerStyle={{gap: 20, paddingHorizontal: 10}}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}>
          {dashboardHeaderTabs.map(t => (
            <View
              key={t.name}
              style={[
                styles.innerBox,
                {backgroundColor: currentTheme.contrastColor},
              ]}>
              <View style={styles.infoContainer}>
                <Text
                  style={[styles.textLabel, {color: currentTheme.baseColor}]}>
                  {t.name}
                </Text>
                <Text
                  style={[
                    styles.textInfo,
                    {color: currentTheme.baseColor},
                  ]}>{`${app.currency} ${
                  t.name === 'This Month' ? monthlySales : todaySalesNum
                }`}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {searchBar && (
          <View style={{paddingHorizontal: 10}}>
            <Pressable
              style={[
                styles.searchQueryContainer,
                {backgroundColor: currentTheme.contrastColor},
              ]}
              onPress={searchBarPressAction}>
              <View
                style={[
                  styles.searchQueryInput,
                  {borderColor: currentTheme.baseColor},
                ]}>
                <Text
                  style={[
                    styles.searchQueryInputText,
                    {color: currentTheme.baseColor},
                  ]}>
                  {t('d_header_dummy_searchplaceholder')}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  parent: {gap: 6},
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
    elevation: 10,
  },
  textLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    fontSize: 22,
    textAlign: 'center',
  },
  searchQueryContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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

export default DashboardHeader;
