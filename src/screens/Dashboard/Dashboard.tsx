import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import DashboardHeader from '../../components/DashboardHeader';
import {navigate, prepareNavigation} from '../../utils/nagivationUtils';
import {useAnalytics, useTheme} from '../../hooks/index';
import PressableContainer from './components/PressableContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import WeeklySalesInfoGraph from './components/WeeklySalesInfoGraph';
import TodayBestSellerInfoGraph from './components/TodayBestSellerInfoGraph';
import FloatingPayButton from './components/FloatingPayButton';
import SlideUpContainer from '../../components/SlideUpContainer';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import ScanQRToPay from '../../components/ScanQRToPay';
import {colors, deviceHeight} from '../../utils/Constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import RequestedPayment from '../ConfirmRequestedPayment/ConfirmRequestedPayment';

const DashboardOptions = [
  {
    id: 0,
    title: 'Inventory',
    navigateTo: 'MyInventory',
    icon: (color: string) => (
      <Icon3 name="codepen-circle" size={24} color={color} />
    ),
  },

  {
    id: 1,
    title: 'Analytics',
    navigateTo: 'Analytics',
    icon: (color: string) => <Icon2 name="analytics" size={24} color={color} />,
  },
  {
    id: 3,
    title: 'Employees',
    navigateTo: 'Employees',
    icon: (color: string) => (
      <Icon name="people-sharp" size={24} color={color} />
    ),
  },
  {
    id: 4,
    title: 'Customers',
    navigateTo: 'Customers',
    icon: (color: string) => (
      <Icon name="people-sharp" size={24} color={color} />
    ),
  },
];

const Dashboard = () => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const [openRequestPayment, setOpenRequestPayment] = useState<boolean>(false);
  const [openQRCode, setOpenQRCode] = useState<boolean>(false);
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {currency} = useSelector((s: RootState) => s.appData.app);

  const [payableAmount, setPayableAmount] = useState<number>(0);

  const handleOpenRequestPayment = () => setOpenRequestPayment(true);
  const handleCloseQRCode = () => {
    setPayableAmount(0);
    setOpenQRCode(false);
  };
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
      setOpenQRCode(false);
      unverifiedAlertAnimatedStylesToogleTimeoutId &&
        clearTimeout(unverifiedAlertAnimatedStylesToogleTimeoutId);
    };
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.baseColor}}>
     
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Header
          name="Dashboard"
          menuButton
          titleColor={currentTheme.header.textColor}
          customComponent={true}
          renderItem={<Icon4
                    name="qr-code-scanner"
                    size={26}
                    color={currentTheme.contrastColor}
                  />}
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
              You're email is not verified!
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
                  click to verify.
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
          <DashboardHeader flex={false} />
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
              Today's best-sellers {'(sales per product)'}
            </Text>
            <TodayBestSellerInfoGraph />
          </View>
          <View style={styles.graphContainer}>
            <Text
              style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
              Past 7 Day Recap {'(sales per day)'}
            </Text>
            <WeeklySalesInfoGraph />
          </View>
        </View>
      </ScrollView>
      <SlideUpContainer
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
      </SlideUpContainer>
      {/* <FloatingPayButton pressAction={handleOpenRequestPayment} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  navigationBtnsContainer: {
    alignItems: 'flex-start',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 10,
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
