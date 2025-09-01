import {ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import React from 'react';
import {useTheme} from '../../../../hooks';
import {BusinessTiming as BusinessTimingType} from '../../../../../types';
import FallbackMessage from '../../../../components/FallbackMessage';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import TimeSlot from './subComponents/TimeSlot';

const BusinessTiming = () => {
  const {currentTheme} = useTheme();
  const {businessTimings} = useSelector((s: RootState) => s.openClose);
  return (
    <KeyboardAvoidingView
      style={{
        paddingTop: 20,
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: currentTheme.contrastColor,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {businessTimings.length > 0 ? (
        <ScrollView
          style={{flex: 1}}
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {businessTimings.map((wholeDay, idx) => {
            const timing: BusinessTimingType | undefined = businessTimings.find(
              (t: BusinessTimingType) => t.day === wholeDay.day,
            );
            return <TimeSlot wholeDay={wholeDay} timing={timing} key={idx} />;
          })}
        </ScrollView>
      ) : (
        <FallbackMessage text="No timings are set." />
      )}
    </KeyboardAvoidingView>
  );
};

export default BusinessTiming;
