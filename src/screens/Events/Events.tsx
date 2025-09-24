import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useTheme, useAnalytics, useStorage} from '../../hooks';
import Tab from './components/Tab';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {handleEvents, resetEventCount} from '../../../store/slices/events';
import HeaderIcon from '../../components/HeaderIcon';
import FallbackMessage from '../../components/FallbackMessage';
import {useNetInfo} from '@react-native-community/netinfo';

const Events = () => {
  const d = useDispatch<AppDispatch>();
  const {isConnected} = useNetInfo();
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const {user} = useSelector((s: RootState) => s.appData)!;
  if (!user) {
    return null;
  }
  const {getEvents} = useStorage().user;
  const [loading, setLoading] = useState<boolean>(false);
  const {eventData} = useSelector((s: RootState) => s.events);
  const fetchEvents = async () => {
    const data = {
      query: {
        role: user.role,
        oid: owner._id,
      },
    };
    if (isConnected) {
      await getEvents(data, setLoading);
    } else {
      return;
    }
  };
  useEffect(() => {
    let isMount: boolean = true;
    if (isMount) {
      d(handleEvents([]));
      d(resetEventCount());
    }
    fetchEvents();
  }, [isConnected]);
  return (
    <View style={styles.parent}>
      <Header
        name="Inbox"
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.contrastColor}
        curved
        backButton
        customComponent={true}
        renderItem={
          <HeaderIcon iconColor={currentTheme.baseColor}>
            {loading ? (
              <ActivityIndicator size={28} color={currentTheme.contrastColor} />
            ) : null}
          </HeaderIcon>
        }
      />
      <View style={styles.contentContainer}>
        {eventData.events.length === 0 ? (
          <FallbackMessage
            text={
              isConnected
                ? 'Your inbox is empty!'
                : 'Internet connection required.'
            }
          />
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                borderRadius: 20,
                padding: 2,
                gap: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: currentTheme.baseColor,
                  textAlign: 'center',
                }}>
                click to see details
              </Text>
            </View>
            <FlatList
              data={[...(eventData.events || [])].reverse()}
              keyExtractor={s => s._id}
              renderItem={({item, index}) => (
                <Tab
                  i={item}
                  lastIndex={eventData.events.length - 1 === index}
                  key={item._id}
                />
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  contentContainer: {flex: 1, marginTop: 2, paddingHorizontal: 10},
});

export default Events;
