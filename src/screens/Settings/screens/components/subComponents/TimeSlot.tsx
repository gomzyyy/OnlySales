import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useAnalytics, useStorage, useTheme} from '../../../../../hooks';
import {BusinessTiming} from '../../../../../../types';
import LongPressEnabled from '../../../../../customComponents/LongPressEnabled';
import {resetAndNavigate} from '../../../../../utils/nagivationUtils';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../../store/store';
import {deleteBusinessTimingAPI} from '../../../../../api/api.timing';
import {colors, deviceHeight} from '../../../../../utils/Constants';
import {showToast} from '../../../../../service/fn';
import SlideUpContainer from '../../../../../components/SlideUpContainer';
import {global} from '../../../../../styles/global';
import Icon from 'react-native-vector-icons/Feather';

type TimeSlotType = {
  wholeDay: BusinessTiming;
  timing: BusinessTiming | undefined;
};

const TimeSlot: React.FC<TimeSlotType> = ({wholeDay, timing}) => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {owner} = useAnalytics();
  if (!user) {
    resetAndNavigate('Login');
    return null;
  }
  const {updateUser} = useStorage().local;
  const [showTSLPOptions, setShowTSLPOptions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const openTSLPOptions = () => setShowTSLPOptions(true);
  const closeTSLPOptions = () => setShowTSLPOptions(false);

  const handleDeleteTimeSlot = async () => {
    const data = {
      query: {role: user.role, oid: owner._id, btid: wholeDay._id},
    };
    const res = await deleteBusinessTimingAPI(data, setLoading);
    showToast({type: 'info', text1: res.message});
    if (res.success) {
      await updateUser(undefined, setLoading);
      closeTSLPOptions();
    }
  };

  return (
    <LongPressEnabled longPressAction={openTSLPOptions}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingVertical: 10,
          borderBottomWidth: 0.5,
          borderColor: currentTheme.borderColor,
        }}>
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            color: currentTheme.textColor,
          }}>
          {wholeDay.day}
        </Text>
        <View>
          {timing && !timing.isClosed && timing.slots.length > 0 ? (
            timing.slots.map((s, i) => (
              <LongPressEnabled key={i} longPressAction={() => {}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: currentTheme.textColor,
                    textAlign: 'center',
                    fontWeight: '600',
                  }}>
                  {s.open} - {s.close}
                </Text>
              </LongPressEnabled>
            ))
          ) : (
            <Text
              style={{
                fontSize: 14,
                color: 'gray',
                textAlign: 'center',
              }}>
              Closed
            </Text>
          )}
        </View>
        <SlideUpContainer
          open={showTSLPOptions}
          close={closeTSLPOptions}
          height={deviceHeight * 0.14}>
          <View
            style={[
              styles.parent,
              global.modalContainerRounded,
              global.modalContainerCommonStyles,
              global.modalContainerBottomLifted,
              {backgroundColor: currentTheme.contrastColor},
            ]}>
            <TouchableOpacity
              style={[styles.buttonDanger, {backgroundColor: colors.danger}]}
              activeOpacity={0.8}
              onPress={handleDeleteTimeSlot}>
              {loading ? (
                <ActivityIndicator
                  size={22}
                  color={currentTheme.contrastColor}
                />
              ) : (
                <Icon
                  name="delete"
                  size={22}
                  color={currentTheme.contrastColor}
                />
              )}
            </TouchableOpacity>
          </View>
        </SlideUpContainer>
      </View>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.12,
    maxHeight: 240,
    padding: 20,
  },
  container: {paddingHorizontal: 10},
  buttonDanger: {
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonIconContainer: {
    alignItems: 'center',
  },
  buttonDangerText: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export default TimeSlot;
