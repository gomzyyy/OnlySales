import {View, StyleSheet, ScrollView, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import DashboardHeader from '../../components/DashboardHeader';
import {navigate} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';
import PressableContainer from './components/PressableContainer';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon7 from 'react-native-vector-icons/FontAwesome6';
import WeeklySalesInfoGraph from './components/WeeklySalesInfoGraph';
import TodayBestSellerInfoGraph from './components/TodayBestSellerInfoGraph';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useTranslation} from 'react-i18next';
import SlideUpContainer from '../../components/SlideUpContainer';
import QueryContainer from './components/QueryContainer';
import NotVerifiedAlert from './components/animated/NotVerifiedAlert';
import OpenMenuButton from './components/animated/OpenMenuButton';
import {useSocket} from '../../hooks/index';
import {APP_VERSION} from '@env';
import HeaderIcon from '../../components/HeaderIcon';
import OrderPageRedirectQRCode from '../../components/OrderPageRedirectORCode';
import {deviceHeight} from '../../utils/Constants';
import LinearGradient from 'react-native-linear-gradient';
import PromotionalCarousel from '../../components/animated/PromotionalCarousel';
import NotesContainer from '../../components/NotesContainer';

const Dashboard = () => {
  const {t} = useTranslation('dashboard');
  const {socket} = useSocket();
  const {eventData, orderData} = useSelector((s: RootState) => s.events);
  const [openOrderOnlineQR, setOpenOrderOnlineQR] = useState<boolean>(false);
  const [openNotes, setOpenNotes] = useState<boolean>(false);
  const DashboardOptions = [
    {
      id: 0,
      title: t('d_options_inventory'),
      navigateTo: 'MyInventory',
      icon: (color: string) => (
        <Icon3 name="codepen-circle" size={24} color={color} />
      ),
      onPress: undefined,
    },
    {
      id: 5,
      title: t('d_options_insta_buy'),
      navigateTo: undefined,
      icon: (color: string) => <Icon3 name="qrcode" size={24} color={color} />,
      onPress: () => setOpenOrderOnlineQR(true),
    },
    {
      id: 1,
      title: t('d_options_analytics'),
      navigateTo: 'Analytics',
      icon: (color: string) => (
        <Icon2 name="analytics" size={24} color={color} />
      ),
      onPress: undefined,
    },
    {
      id: 3,
      title: t('d_options_employees'),
      navigateTo: 'Employees',
      icon: (color: string) => <Icon2 name="work" size={24} color={color} />,
      onPress: undefined,
    },
    {
      id: 4,
      title: t('d_options_customers'),
      navigateTo: 'Customers',
      icon: (color: string) => (
        <Icon name="people-sharp" size={24} color={color} />
      ),
      onPress: undefined,
    },
    {
      id: 6,
      title: 'Invoices',
      navigateTo: 'Invoices',
      icon: (color: string) => (
        <Icon7 name="file-invoice" size={24} color={color} />
      ),
      onPress: undefined,
    },
    {
      id: 7,
      title: 'Settings',
      navigateTo: 'Settings',
      icon: (color: string) => <Icon name="settings" size={24} color={color} />,
      onPress: undefined,
    },
    {
      id: 8,
      title: 'Notes',
      navigateTo: undefined,
      icon: (color: string) => (
        <Icon2 name="sticky-note-2" size={24} color={color} />
      ),
      onPress: () => setOpenNotes(true),
    },
  ];

  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [openQuery, setOpenQuery] = useState<boolean>(false);
  const [overScrolled, setOverScrolled] = useState<boolean>(false);

  const closeDropDown = () => setOpenDropDown(false);

  const closeQuery = () => {
    setOpenQuery(false);
  };
  const closeOrderOnlineQR = () => {
    setOpenOrderOnlineQR(false);
  };
  const closeNotes = () => {
    setOpenNotes(false);
  };

  useEffect(() => {
    socket?.on('getOnlineUsers', d => console.log(d));
    socket?.on('getOnlineUsers_meta_data', d => console.log(d));
    console.log(APP_VERSION);
  }, [socket]);

  return (
    <View style={{flex: 1, backgroundColor: currentTheme.contrastColor}}>
      <OpenMenuButton open={overScrolled} />
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        onScroll={e => {
          setOverScrolled(e.nativeEvent.contentOffset.y > 70);
          openDropDown && setOpenDropDown(false);
        }}>
        <Header
          name={t('header_title')}
          menuButton
          titleColor={currentTheme.header.textColor}
          headerBgColor={currentTheme.baseColor}
          customComponent={true}
          curved
          renderItem={
            <HeaderIcon
              label="Inbox"
              showAlertDot={eventData.newEventCount !== 0}
              alertContent={eventData.newEventCount}>
              <Icon3 name="inbox" size={20} color={currentTheme.baseColor} />
            </HeaderIcon>
          }
          renderItem1={
            <HeaderIcon
              label="Orders"
              showAlertDot={orderData.newOrderCount !== 0}
              alertContent={orderData.newOrderCount}>
              <Icon5
                name="cart-check"
                size={20}
                color={currentTheme.baseColor}
              />
            </HeaderIcon>
          }
          customAction={() => navigate('Events')}
          customAction1={() => navigate('Orders')}
          customAction2={() => setOpenOrderOnlineQR(true)}
        />
        {/* {openDropDown && (
          <DropDownMenu
            visible={openDropDown}
            close={closeDropDown}
            dropDownOptions={dropDownOptions}
            top={60}
            right={10}
          />
        )} */}
        {/* <Pressable
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 6,
            paddingVertical: 2,
            alignSelf: 'center',
            marginBottom: 6,
          }}
          onPress={() => navigate('Test')}>
          <Text
            style={{
              color: currentTheme.baseColor,
              fontSize: 16,
              fontWeight: '600',
            }}>
            Test UI
          </Text>
        </Pressable> */}
        {!user.email?.verified && <NotVerifiedAlert />}
        <View style={{paddingHorizontal: 10, marginTop: 10}}>
          <PromotionalCarousel />
        </View>
        <View style={styles.contentContainer}>
          <DashboardHeader
            flex={false}
            searchBarPressAction={() => navigate('SearchFeatures')}
          />
          <View style={{paddingHorizontal: 10}}>
            <View
              style={{
                backgroundColor: currentTheme.contrastColor,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                height: deviceHeight * 0.25,
                minHeight: 140,
                maxHeight: 160,
                overflow: 'hidden',
              }}>
              <LinearGradient
                colors={[
                  currentTheme.fadeColor,
                  currentTheme.contrastColor,
                  currentTheme.contrastColor,
                ]}
                style={styles.navigationBtnsContainer}
                start={{x: 0.5, y: 1}}
                end={{x: 0.5, y: 0}}>
                <ScrollView
                  style={{flex: 1}}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 24,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {DashboardOptions.map(s => (
                    <View key={s.id} style={{width: '18%'}}>
                      <PressableContainer
                        navigateTo={s.navigateTo}
                        title={s.title}
                        key={s.id}
                        onPress={s.onPress}>
                        {s.icon(currentTheme.baseColor)}
                      </PressableContainer>
                    </View>
                  ))}
                </ScrollView>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.graphContainer}>
            <Text style={[styles.graphLabel, {color: currentTheme.baseColor}]}>
              {t('d_todaybestseller_title')}
            </Text>
            <TodayBestSellerInfoGraph />
          </View>
          <View style={styles.graphContainer}>
            <Text style={[styles.graphLabel, {color: currentTheme.baseColor}]}>
              {t('d_weeklysalesinfograph_title')}
            </Text>
            <WeeklySalesInfoGraph />
          </View>

          <SlideUpContainer open={openQuery} close={closeQuery}>
            <QueryContainer close={closeQuery} />
          </SlideUpContainer>
          <SlideUpContainer
            open={openNotes}
            close={closeNotes}
            height={deviceHeight * 0.62}
            usepadding={false}>
            <NotesContainer close={closeNotes} />
          </SlideUpContainer>
          <SlideUpContainer
            open={openOrderOnlineQR}
            close={closeOrderOnlineQR}
            height={deviceHeight * 0.6 < 460 ? 460 : deviceHeight * 0.6}>
            <OrderPageRedirectQRCode />
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
    marginTop: 20,
  },
  navigationBtnsContainer: {
    alignItems: 'flex-start',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 10,
    flex: 1,
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
