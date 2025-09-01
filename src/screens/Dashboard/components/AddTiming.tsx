import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {SetStateAction} from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import {WeekDays} from '../../../../enums';
import Picker from '../../../customComponents/Picker';
import {global} from '../../../styles/global';
import Icon from 'react-native-vector-icons/Ionicons';

type HM = {HH: string; mm: string};

type AddTimingProps = {
  slotDay: WeekDays;
  opentiming: HM;
  closetiming: HM;
  setSlotday: React.Dispatch<SetStateAction<WeekDays>>;
  setOpenTiming: React.Dispatch<SetStateAction<HM>>;
  setCloseTiming: React.Dispatch<SetStateAction<HM>>;
  onDone?: () => Promise<void>;
  loading?: boolean;
};

const AddTiming: React.FC<AddTimingProps> = ({
  slotDay,
  setSlotday,
  opentiming,
  closetiming,
  setOpenTiming,
  setCloseTiming,
  onDone,
  loading,
}) => {
  const {currentTheme} = useTheme();

  const inputStyle = {
    flex: 0,
    width: 56,
    height: 42,
    borderWidth: 1,
    borderColor: currentTheme.borderColor,
    borderRadius: 10,
    textAlign: 'center' as const,
    color: currentTheme.textColor,
    backgroundColor: currentTheme.contrastColor,
    fontWeight: '600' as const,
    fontSize: 16,
  };
  return (
    <KeyboardAvoidingView
      style={[
        {
          height: deviceHeight * 0.4,
          backgroundColor: currentTheme.contrastColor,
          padding: 20,
        },
        global.modalContainerRounded,
        global.modalContainerCommonStyles,
        global.modalContainerBottomLifted,
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 12,
          color: currentTheme.textColor,
        }}>
        {slotDay ?? 'Add Slot'}
      </Text>
      <Picker enabled data={WeekDays} value={slotDay} setState={setSlotday} />
      <Text style={{color: 'grey', textAlign: 'center', marginTop: 32}}>
        Choose timing in 24-Hour format
      </Text>
      <ScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View
          style={{
            paddingVertical: 10,
            borderBottomWidth: 0.6,
            borderColor: currentTheme.borderColor,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <TextInput
              keyboardType="number-pad"
              placeholder="HH"
              placeholderTextColor="#999"
              value={opentiming.HH}
              onChangeText={t => setOpenTiming(z => ({...z, HH: t}))}
              maxLength={2}
              style={inputStyle}
            />
            <Text style={{marginHorizontal: 8, color: currentTheme.textColor}}>
              :
            </Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="mm"
              placeholderTextColor="#999"
              value={opentiming.mm}
              onChangeText={t => setOpenTiming(z => ({...z, mm: t}))}
              maxLength={2}
              style={inputStyle}
            />
          </View>
          <Text style={{fontWeight: '600' as const, fontSize: 16}}>to</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              keyboardType="number-pad"
              placeholder="HH"
              placeholderTextColor="#999"
              value={closetiming.HH}
              onChangeText={t => setCloseTiming(z => ({...z, HH: t}))}
              maxLength={2}
              style={inputStyle}
            />
            <Text style={{marginHorizontal: 8, color: currentTheme.textColor}}>
              :
            </Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="mm"
              placeholderTextColor="#999"
              value={closetiming.mm}
              onChangeText={t => setCloseTiming(z => ({...z, mm: t}))}
              maxLength={2}
              style={inputStyle}
            />
          </View>
        </View>
      </ScrollView>

      <View style={{marginTop: 10}}>
        <TouchableOpacity
          style={{
            backgroundColor: currentTheme.baseColor,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={0.8}
          onPress={onDone}>
          {loading ? (
            <ActivityIndicator size={22} color={currentTheme.contrastColor} />
          ) : (
            <Icon name="cloud-done" size={22} color={currentTheme.contrastColor} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTiming;
