import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';

const circleColors = [
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#9D4EDD',
  '#FF9671',
  '#00C9A7',
  '#FEC260',
];
type AILoaderProps = {
  show: boolean;
  m?:number;
  mb?: number;
  mt?: number;
  mr?: number;
  ml?: number;
};
const AILoader: React.FC<AILoaderProps> = ({show, mt, mb, ml, mr,m}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!show) {
      rotation.value = withRepeat(withTiming(360, {duration: 2000}), -1, false);
    }
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <View
      style={[
        styles.loaderContainer,
        {marginTop: mt, marginBottom: mb, marginRight: mr, marginLeft: ml,margin:m},
      ]}>
      <Animated.View style={[animatedStyle]}>
        <Svg width="100" height="100" viewBox="0 0 100 100">
          {circleColors.map((color, index) => {
            const angle = (2 * Math.PI * index) / circleColors.length;
            const radius = 35;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            return <Circle key={index} cx={x} cy={y} r="6" fill={color} />;
          })}
        </Svg>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AILoader;
