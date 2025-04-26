import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import DashboardHeader from '../../components/DashboardHeader';
import {navigate, prepareNavigation} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';
import PressableContainer from './components/PressableContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/Entypo';
import WeeklySalesInfoGraph from './components/WeeklySalesInfoGraph';
import TodayBestSellerInfoGraph from './components/TodayBestSellerInfoGraph';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {colors, deviceHeight} from '../../utils/Constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import SlideUpContainer from '../../components/SlideUpContainer';
import useQuery from './hooks/hooks';

const Dashboard = () => {
  const {t} = useTranslation('dashboard');

  const DashboardOptions = [
    {
      id: 0,
      title: t('d_options_inventory'),
      navigateTo: 'MyInventory',
      icon: (color: string) => (
        <Icon3 name="codepen-circle" size={24} color={color} />
      ),
    },

    {
      id: 1,
      title: t('d_options_analytics'),
      navigateTo: 'Analytics',
      icon: (color: string) => (
        <Icon2 name="analytics" size={24} color={color} />
      ),
    },
    {
      id: 3,
      title: t('d_options_employees'),
      navigateTo: 'Employees',
      icon: (color: string) => (
        <Icon name="people-sharp" size={24} color={color} />
      ),
    },
    {
      id: 4,
      title: t('d_options_customers'),
      navigateTo: 'Customers',
      icon: (color: string) => (
        <Icon name="people-sharp" size={24} color={color} />
      ),
    },
  ];

  const {currentTheme} = useTheme();
  const [openRequestPayment, setOpenRequestPayment] = useState<boolean>(false);
  const [openQuery, setOpenQuery] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [payableAmount, setPayableAmount] = useState<number>(0);

  const unverifiedAlertHeight = useSharedValue(0);

  const unverifiedAlertAnimatedStyles = useAnimatedStyle(() => {
    return {
      height: withTiming(unverifiedAlertHeight.value, {duration: 200}),
    };
  });
  const closeUnverifiedAlert = () => (unverifiedAlertHeight.value = 0);

  useEffect(() => {
    prepareNavigation();
    let unverifiedAlertAnimatedStylesToogleTimeoutId: NodeJS.Timeout | null;
    if (user.email && !user.email.verified) {
      unverifiedAlertAnimatedStylesToogleTimeoutId = setTimeout(
        () => (unverifiedAlertHeight.value = 30),
        1500,
      );
    }
    return () => {
      setPayableAmount(0);
      setOpenRequestPayment(false);
      unverifiedAlertAnimatedStylesToogleTimeoutId &&
        clearTimeout(unverifiedAlertAnimatedStylesToogleTimeoutId);
    };
  }, []);

  const {
    customersByQuery,
    CustomerTab,
    soldProductsByQueryDate,
    DateWithSoldProductTab,
  } = useQuery({query});

  const closeQuery = () => {
    setOpenQuery(false);
    setQuery('');
  };

  return (
    <View style={{flex: 1, backgroundColor: currentTheme.baseColor}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Header
          name={t('header_title')}
          menuButton
          titleColor={currentTheme.header.textColor}
          customComponent={true}
          renderItem={
            <Icon4 name="code" size={26} color={currentTheme.contrastColor} />
          }
          customAction={() => setOpenQuery(true)}
        />
        {!user.email?.verified && (
          <Animated.View
            style={[
              {
                backgroundColor: currentTheme.contrastColor,
                borderBottomRightRadius: 14,
                borderBottomLeftRadius: 14,
                marginBottom: 10,
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                position: 'static',
                top: 0,
                elevation: 10,
              },
              unverifiedAlertAnimatedStyles,
            ]}>
            <Text style={{fontSize: 16, color: colors.danger}}>
              {t('d_email_not_verified')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Pressable
                onPress={() => {
                  unverifiedAlertHeight.value = 0;
                  navigate('RequestOTPEmail');
                }}>
                <Text style={{fontSize: 16, color: currentTheme.baseColor}}>
                  {t('d_email_not_verified_clicktoverify')}
                </Text>
              </Pressable>
              <Pressable
                style={{alignItems: 'center'}}
                onPress={closeUnverifiedAlert}>
                <Icon name="close" size={14} />
              </Pressable>
            </View>
          </Animated.View>
        )}
        <View style={styles.contentContainer}>
          <DashboardHeader
            flex={false}
            searchBarPressAction={() => navigate('SearchFeatures')}
          />
          <View style={{paddingHorizontal: 10}}>
            <View
              style={{
                backgroundColor: currentTheme.contrastColor,
                paddingBottom: 10,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
              }}>
              <View style={styles.navigationBtnsContainer}>
                {DashboardOptions.map(s => (
                  <PressableContainer
                    navigateTo={s.navigateTo}
                    title={s.title}
                    key={s.id}>
                    {s.icon(currentTheme.header.textColor)}
                  </PressableContainer>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.graphContainer}>
            <Text
              style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
              {t('d_todaybestseller_title')}
            </Text>
            <TodayBestSellerInfoGraph />
          </View>
          <View style={styles.graphContainer}>
            <Text
              style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
              {t('d_weeklysalesinfograph_title')}
            </Text>
            <WeeklySalesInfoGraph />
          </View>
          <SlideUpContainer
            open={openQuery}
            close={closeQuery}
            height={deviceHeight * 0.36}>
            <View
              style={{
                minHeight: deviceHeight * 0.36,
                height: 'auto',
                backgroundColor: currentTheme.contrastColor,
                marginBottom: 10,
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}>
              <ScrollView style={{flex: 1}}>
                <Text
                  style={{fontSize: 20, fontWeight: 600, textAlign: 'center'}}>
                  Run a Query
                </Text>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  style={[
                    styles.inputText,
                    {borderColor: currentTheme.modal.inputBorder},
                  ]}
                  placeholder="enter your query"
                  placeholderTextColor={'grey'}
                />
                {customersByQuery.length > 0 && (
                  <View style={{marginTop: 10}}>
                    <Text
                      style={{fontSize: 16, fontWeight: 600, paddingLeft: 20}}>
                      Found customers:
                    </Text>
                    {customersByQuery.map(s => (
                      <CustomerTab key={s._id} customer={s} />
                    ))}
                  </View>
                )}
                {soldProductsByQueryDate.length !== 0 && (
                  <View style={{marginTop: 10}}>
                    <Text
                      style={{fontSize: 16, fontWeight: 600, paddingLeft: 20}}>
                      Found records:
                    </Text>
                    {soldProductsByQueryDate.map(s => (
                      <DateWithSoldProductTab key={s.date} data={s} />
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </SlideUpContainer>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingBottom: 90,
  },
  navigationBtnsContainer: {
    alignItems: 'flex-start',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 10,
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
    marginTop: 30,
  },
  graphContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  graphLabel: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Dashboard;

{
  /* <SlideUpContainer
        open={openQRCode}
        close={handleCloseQRCode}
        opacity={0.6}
        height={deviceHeight * 0.5}>
        <ScanQRToPay
          cancel={handleCloseQRCode}
          callback={() => {}}
          currency={currency}
          pa="gomzydhingra0001@okhdfcbank"
          pn="Khata App"
          payableAmount={payableAmount}
        />
      </SlideUpContainer> */
}
