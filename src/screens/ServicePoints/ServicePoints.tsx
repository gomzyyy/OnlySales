import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useTheme, useAnalytics, useStorage, useHaptics} from '../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import FallbackMessage from '../../components/FallbackMessage';
import HeaderIcon from '../../components/HeaderIcon';
import Icon from 'react-native-vector-icons/Octicons';
import SlideUpContainer from '../../components/SlideUpContainer';
import {deviceHeight} from '../../utils/Constants';
import CreateServicePoint from '../../components/CreateServicePoint';
import {showToast} from '../../service/fn';
import {back} from '../../utils/nagivationUtils';
import Tab from './components/Tab';

const ServicePoints = () => {
  const d = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const {user} = useSelector((s: RootState) => s.appData)!;
  if (!user) {
    return null;
  }
  const {lightTap} = useHaptics();
  const {owner} = useAnalytics();

  const {getAllServicePoints} = useStorage().user;
  const [openCreateSp, setopenCreateSp] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const {points} = useSelector((s: RootState) => s.servicePoints);
  const fetchPoints = async () => {
    const data = {
      query: {
        role: user.role,
        oid: owner._id,
      },
    };
    const res = await getAllServicePoints(data, setLoading);
    if (!res.success) {
      showToast({type: 'error', text1: res.message});
      back();
    }
  };
  const handleCloseCreateSp = () => setopenCreateSp(false);

  useEffect(() => {
    fetchPoints();
  }, []);
  return (
    <View style={styles.parent}>
      <Header
        name="Service Points"
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.contrastColor}
        curved
        backButton
        customComponent
        renderItem={
          <HeaderIcon label="Add">
            <Icon name="plus" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction={() => {
          setopenCreateSp(true);
          lightTap();
        }}
      />
      <View style={styles.contentContainer}>
        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator
              size={50}
              color={currentTheme.baseColor}
              style={{marginBottom: 80}}
            />
          </View>
        ) : points.length === 0 ? (
          <FallbackMessage text="Add service point to start..." />
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
              data={[...(points || [])].reverse()}
              keyExtractor={s => s._id}
              renderItem={({item, index}) => <Tab sp={item} />}
            />
          </View>
        )}
      </View>
      {openCreateSp && (
        <SlideUpContainer
          open={openCreateSp}
          close={handleCloseCreateSp}
          height={deviceHeight * 0.58}>
          <CreateServicePoint callback={handleCloseCreateSp} />
        </SlideUpContainer>
      )}
    
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  contentContainer: {flex: 1, marginTop: 2, paddingHorizontal: 10},
});

export default ServicePoints;
