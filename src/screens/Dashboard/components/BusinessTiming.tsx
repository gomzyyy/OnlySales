import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../hooks';
import {BusinessTiming as BusinessTimingType} from '../../../../types'; // adjust import path
import {WeekDays} from '../../../../enums';
import SlideUpContainer from '../../../components/SlideUpContainer';
import AddTiming from './AddTiming';

const BusinessTiming = () => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();

  const [addingSlot, setAddingSlot] = useState<boolean>(false);
  const [slotDay, setslotDay] = useState<WeekDays>();
  const [opentimings, setOpentimings] = useState<{HH: string; mm: string}[]>(
    [],
  );
  const [closeimings, setClosetimings] = useState<{HH: string; mm: string}[]>(
    [],
  );

  const openAddingSlot = (nameOfDay?: WeekDays) => {
    setslotDay(nameOfDay);
    setAddingSlot(true);
  };
  const closeAddingSlot = () => setAddingSlot(false);

  return (
    <KeyboardAvoidingView
      style={{
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 10,
        height: deviceHeight * 0.6,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        elevation: 30,
        maxHeight: 600,
        maxWidth: 500,
        backgroundColor: currentTheme.contrastColor,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 15,
          color: currentTheme.textColor,
        }}>
        Manage your timings
      </Text>

      <ScrollView
        style={{flex: 1}}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {Object.values(WeekDays).map((day, idx) => {
          const timing: BusinessTimingType | undefined =
            owner.businessTiming.find((t: BusinessTimingType) => t.day === day);

          return (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                paddingVertical: 10,
                borderBottomWidth: 0.5,
                borderColor: currentTheme.borderColor,
              }}>
              {/* Day name */}
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: '600',
                  color: currentTheme.textColor,
                }}>
                {day}
              </Text>

              {/* Slots */}
              <View style={{flex: 2}}>
                {timing && !timing.isClosed && timing.slots.length > 0 ? (
                  timing.slots.map((s, i) => (
                    <Text
                      key={i}
                      style={{
                        fontSize: 14,
                        color: currentTheme.textColor,
                        textAlign: 'center',
                      }}>
                      {s.open} - {s.close}
                    </Text>
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

              <TouchableOpacity
                style={{
                  backgroundColor: currentTheme.baseColor,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
                onPress={() => openAddingSlot(day)}>
                <Text style={{color: '#fff', fontWeight: '600'}}>Edit</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <SlideUpContainer open={addingSlot} close={closeAddingSlot} usepadding={false}>
          <AddTiming
            slotDay={slotDay}
            opentiming={opentimings}
            closetiming={closeimings}
            setSlotday={setslotDay}
            setCloseTiming={setClosetimings}
            setOpenTiming={setOpentimings}
          />
        </SlideUpContainer>
      </ScrollView>
      <View
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: currentTheme.baseColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => openAddingSlot()}>
          <Text style={{color: currentTheme.contrastColor, fontWeight: '600'}}>
            + Add Slot
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BusinessTiming;
