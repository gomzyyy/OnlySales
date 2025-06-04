import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {RootState} from '../../store/store';
import {useSelector} from 'react-redux';
import {useTheme, useAnalytics} from '../hooks/index';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

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
  const totalMonthlySales = useMemo(() => {
    if (!soldThisMonth.length) return 0;
    return soldThisMonth.reduce(
      (acc, s) =>
        acc +
        ((s.product.discountedPrice
          ? s.product.discountedPrice
          : s.product.basePrice) * s.count || 0),
      0,
    );
  }, [soldThisMonth]);
  const onGoingDaySales = useMemo(() => {
    if (todaySales.length === 0) return 0;
    return todaySales.reduce(
      (acc, s) =>
        acc +
        ((s.product.discountedPrice
          ? s.product.discountedPrice
          : s.product.basePrice) * s.count || 0),
      0,
    );
  }, [todaySales]);

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
    {
      name: t('d_header_thismonth'),
      data: {value: monthlySales},
    },
    {
      name: t('d_header_today'),
      data: {value: todaySalesNum},
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{flex: flex ? 1 : 0}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        <View
          style={[
            styles.container,
            {gap: 20, paddingHorizontal: 10, justifyContent: 'space-between'},
          ]}>
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
                  ]}>{`${app.currency} ${t.data.value.toLocaleString()}`}</Text>
              </View>
            </View>
          ))}
        </View>
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
                  {
                    backgroundColor: currentTheme.fadeColor,
                  },
                ]}>
                <Animated.Text
                  style={[
                    styles.searchQueryInputText,
                    {color: currentTheme.baseColor},
                  ]}>
                  {t('d_header_dummy_searchplaceholder0')}
                </Animated.Text>
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
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    elevation: 10,
  },
  textLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    fontSize: 20,
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
