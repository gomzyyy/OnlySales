import {Pressable, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon1 from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/Feather';
import {useTheme} from '../../../hooks';

type ExpandButtonProps = {
  onSearchBtnPress: () => void;
  onBackBtnPress: () => void;
};

const ExpandButton: React.FC<ExpandButtonProps> = ({
  onSearchBtnPress,
  onBackBtnPress,
}) => {
  const {currentTheme} = useTheme();
  const iconAngle = useSharedValue(0);
  const [btnExpanded, setBtnExpended] = useState<boolean>(false);
  const actionBtnHeight = useSharedValue(50);
  const actionBtnBGOpacity = useSharedValue(0.08)
  const expandBtnAnimation = useAnimatedStyle(() => ({
    height: actionBtnHeight.value,
     backgroundColor: `rgba(0,0,0,${actionBtnBGOpacity.value})`,
  }));
  const expandBtnIconAnimation = useAnimatedStyle(() => ({
    transform: [{rotate: `${iconAngle.value}deg`}],
  }));

  const [backBtnY, searchBtnY] = [useSharedValue(0), useSharedValue(0)];
  const backbtnAnimate = useAnimatedStyle(() => ({
    transform: [{translateY: backBtnY.value}],
  }));
  const searchbtnAnimate = useAnimatedStyle(() => ({
    transform: [{translateY: searchBtnY.value}],
  }));

  const handleFn = (cb: () => void) => {
    setBtnExpended(false);
    setTimeout(cb, 300);
  };

  useEffect(() => {
    actionBtnHeight.value = withTiming(btnExpanded ? 170 : 60, {duration: 200});
    actionBtnBGOpacity.value = withTiming(btnExpanded ? 0.4 : 0.08, {duration: 200});
    iconAngle.value = withTiming(btnExpanded ? 180 : 0, {duration: 200});
    backBtnY.value = withTiming(btnExpanded ? -55 : 0, {duration: 200});
    searchBtnY.value = withTiming(btnExpanded ? -110 : 0, {duration: 200});
  }, [btnExpanded]);

  return (
    <Animated.View
      style={[
        {
         
          borderRadius: 50,
          zIndex: 100,
          position: 'absolute',
          bottom: 80,
          right: 20,
          padding: 6,
          width: 60,
        },
        expandBtnAnimation,
      ]}>
      <View
        style={{
          position: 'relative',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Pressable
          style={{position: 'absolute'}}
          onPress={() => handleFn(onSearchBtnPress)}>
          <Animated.View
            style={[
              {
                borderRadius: 50,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 8,
                elevation: 10,
              },
              searchbtnAnimate,
            ]}>
            <Icon3 name="search" size={14} color={'rgba(0,0,0,0.8)'} />
            <Text style={{fontSize: 10, color: currentTheme.baseColor}}>
              Search
            </Text>
          </Animated.View>
        </Pressable>
        <Pressable
          style={{position: 'absolute'}}
          onPress={() => handleFn(onBackBtnPress)}>
          <Animated.View
            style={[
              {
                borderRadius: 50,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 12,
              },
              backbtnAnimate,
            ]}>
            <Icon2 name="arrow-back" size={14} color={'rgba(0,0,0,0.8)'} />
            <Text style={{fontSize: 10, color: currentTheme.baseColor}}>
              Back
            </Text>
          </Animated.View>
        </Pressable>
        <Pressable onPress={() => setBtnExpended(!btnExpanded)}>
          <Animated.View
            style={[
              {
                borderRadius: 50,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
              },
              expandBtnIconAnimation,
            ]}>
            <Icon1 name="caret-up" size={24} color={'rgba(0,0,0,0.8)'} />
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default ExpandButton;
