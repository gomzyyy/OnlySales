import {StyleSheet, ScrollView, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {deviceWidth} from '../../../utils/Constants';
import {useAnalytics, useTheme} from '../../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {Dataset} from 'react-native-chart-kit/dist/HelperTypes';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {formatNumber} from '../../../service/fn';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

type MonthlySalesInfoGraphProps = {
  pressActions?: () => void;
};

const MonthlySalesInfoGraph: React.FC<MonthlySalesInfoGraphProps> = ({
  pressActions = () => {},
}): React.JSX.Element => {
  const {t} = useTranslation('dashboard');

  const {currentTheme} = useTheme();
  const {weeklySales} = useAnalytics();

  const [tappedIndex, setTappedIndex] = useState<number | undefined>(undefined);

  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const data: Dataset = {
    data: [
      0,
      weeklySales.today.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.yesterday.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.oneDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.twoDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.threeDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.fourDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
      weeklySales.fiveDayAgo.reduce(
        (arr, curr) =>
          arr +
          curr.count * (curr.product.discountedPrice || curr.product.basePrice),
        0,
      ),
    ],
    color: opacity => `rgba(0,0,0,${opacity})`,
  };

  const dotValueOpacity = useSharedValue(1);

  const dotValueOpacityAnimationStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(dotValueOpacity.value, {duration: 600}),
    };
  });

  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDotTap = (index: number) => {
    setTappedIndex(index);
    dotValueOpacity.value = 1;
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = setTimeout(() => (dotValueOpacity.value = 0), 4000);
  };

  const getWeekdayLabels = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const labels: string[] = [''];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(weekdays[date.getDay()]);
    }
    return labels;
  };
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        maxWidth: deviceWidth * 0.96,
        borderRadius: 10,
        marginTop: 10,
        borderWidth:1,
        padding:4,
        borderColor:currentTheme.fadeColor
      }}>
      {!data.data.every(s => s === 0) ? (
        <LineChart
          data={{
            labels: getWeekdayLabels(),
            datasets: [data],
          }}
          width={Math.max(deviceWidth, data.data.length * 90)}
          height={220}
          yAxisLabel={currency}
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            fillShadowGradient: currentTheme.baseColor,
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={{borderRadius: 10}}
          bezier
          onDataPointClick={({index}) => handleDotTap(index)}
          renderDotContent={({index, indexData, x, y}) =>
            index === tappedIndex && (
              <Animated.Text
                key={index}
                style={[
                  {
                    position: 'absolute',
                    left: x,
                    top: y - 15,
                    backgroundColor: '#fff',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#000',
                    elevation: 2,
                  },
                  dotValueOpacityAnimationStyles,
                ]}>
                {indexData === 0
                  ? 'N/A'
                  : `${currency} ${formatNumber(indexData)}`}
              </Animated.Text>
            )
          }
        />
      ) : (
        <View
          style={{
            height: 220,
            // backgroundColor: currentTheme.fadeColor,
            width: deviceWidth * 0.96,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="error" size={80} color={'#ababab'} />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              fontStyle: 'italic',
              color: '#ababab',
            }}>
           Are you on vacations this week?.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  graphContainer: {},
  graphLabel: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default MonthlySalesInfoGraph;
