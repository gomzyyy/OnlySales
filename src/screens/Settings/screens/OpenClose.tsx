import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/Header';
import BusinessTiming from './components/BusinessTiming';
import {useAnalytics, useStorage, useTheme} from '../../../hooks';
import SlideUpContainer from '../../../components/SlideUpContainer';
import {WeekDays} from '../../../../enums';
import AddTiming from '../../Dashboard/components/AddTiming';
import HeaderIcon from '../../../components/HeaderIcon';
import Icon from 'react-native-vector-icons/Octicons';
import {createBusinessTimingAPI} from '../../../api/api.timing';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {resetAndNavigate} from '../../../utils/nagivationUtils';
import {
  COMMON_ERR_MSG_OBJ,
  deviceHeight,
  WEEK_NUM_MAP,
} from '../../../utils/Constants';
import {showToast} from '../../../service/fn';
import {global} from '../../../styles/global';

const OpenClose = () => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {owner} = useAnalytics();
  if (!user) {
    resetAndNavigate('Login');
    return null;
  }
  const {updateUser} = useStorage().local;
  const [addingSlot, setAddingSlot] = useState<boolean>(false);
  const [slotDay, setslotDay] = useState<WeekDays>(WeekDays.Monday);
  const [opentimings, setOpentimings] = useState<{HH: string; mm: string}>({
    HH: '',
    mm: '',
  });
  const [closetimings, setClosetimings] = useState<{HH: string; mm: string}>({
    HH: '',
    mm: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const openAddingSlot = (nameOfDay: WeekDays) => {
    setslotDay(nameOfDay);
    setAddingSlot(true);
  };
  const closeAddingSlot = () => setAddingSlot(false);

  const handleSubmitTiming = async () => {
    const data = {
      query: {role: user.role, oid: owner._id},
      body: {
        day: WEEK_NUM_MAP[slotDay],
        openingtime: `${opentimings.HH}:${opentimings.mm}`,
        closingtime: `${closetimings.HH}:${closetimings.mm}`,
        append: 1,
      },
    };
    const res = await createBusinessTimingAPI(data, setLoading);
    if (res.success) {
      await updateUser(
        () => showToast(COMMON_ERR_MSG_OBJ['err_app_sync']),
        setLoading,
      );
      closeAddingSlot();
    }
  };

  return (
    <View
      style={[
        styles.parent,
        global.modalContainerTopRounded,
        global.modalContainerCommonStyles,
        {backgroundColor: currentTheme.contrastColor},
      ]}>
      <Header
        name="Time manager"
        titleColor={currentTheme.baseColor}
        headerBgColor={currentTheme.bgColor}
        curved
        customComponent={true}
        renderItem={
          <HeaderIcon
            label="Create"
            iconColor={currentTheme.baseColor}
            labelColor={currentTheme.contrastColor}>
            <Icon name="plus" color={currentTheme.contrastColor} size={20} />
          </HeaderIcon>
        }
        customAction={() => setAddingSlot(true)}
      />
      <BusinessTiming />
      <SlideUpContainer open={addingSlot} close={closeAddingSlot}>
        <AddTiming
          slotDay={slotDay}
          opentiming={opentimings}
          closetiming={closetimings}
          setSlotday={setslotDay}
          setCloseTiming={setClosetimings}
          setOpenTiming={setOpentimings}
          onDone={handleSubmitTiming}
          loading={loading}
        />
      </SlideUpContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.7,
  },
  container: {paddingHorizontal: 10},
});

export default OpenClose;
